"""
MudrAA Ingestion Engine - RFC 8785 Canonicalization & Peppol BIS 3.0 Normalizer
Mitigates Threat C.4: XML External Entity (XXE) attacks, injection, and semantic digest collisions.
"""

import json
import hashlib
import unicodedata
from typing import Dict, Any, Tuple
import defusedxml.ElementTree as ET


def rfc8785_canonicalize(obj: Any) -> bytes:
    """
    Implements RFC 8785 (JSON Canonicalization Scheme - JCS).
    - Keys sorted lexicographically at every level.
    - No superfluous whitespace (separators=(',', ':')).
    - Strings normalized to Unicode Normalization Form C (NFC).
    - Numbers formatted without trailing zeros or unnecessary exponent signs.
    """
    def _normalize(item: Any) -> Any:
        if isinstance(item, dict):
            # Sort keys lexicographically and normalize values
            sorted_dict = {}
            for k in sorted(item.keys()):
                norm_k = unicodedata.normalize("NFC", str(k))
                sorted_dict[norm_k] = _normalize(item[k])
            return sorted_dict
        elif isinstance(item, list):
            return [_normalize(sub) for sub in item]
        elif isinstance(item, str):
            return unicodedata.normalize("NFC", item)
        elif isinstance(item, float):
            # IEEE 754 canonical formatting
            if item.is_integer():
                return int(item)
            return item
        else:
            return item

    normalized_data = _normalize(obj)
    # Output compact, key-sorted, UTF-8 encoded bytes
    canonical_json_str = json.dumps(
        normalized_data,
        ensure_ascii=False,
        sort_keys=True,
        separators=(',', ':')
    )
    return canonical_json_str.encode("utf-8")


def compute_canonical_hash(canonical_bytes: bytes) -> Tuple[bytes, str]:
    """Computes SHA-256 digest over canonical bytes, returning raw 32 bytes and hex string."""
    sha256 = hashlib.sha256(canonical_bytes)
    return sha256.digest(), sha256.hexdigest()


class PeppolParseError(Exception):
    """Raised when an electronic invoice violates Peppol BIS 3.0 or fails security checks."""
    pass


def parse_peppol_bis3_xml(xml_content: str) -> Dict[str, Any]:
    """
    Safely parses Peppol BIS 3.0 / UBL 2.1 XML invoices using defusedxml.
    Protects against XXE injection, external DTD loading, and entity expansion exploits.
    """
    try:
        root = ET.fromstring(xml_content)
    except Exception as e:
        raise PeppolParseError(f"Malicious or malformed XML detected: {str(e)}")

    # Common XML namespaces for UBL 2.1 & Peppol BIS Billing 3.0
    ns = {
        "ubl": "urn:oasis:names:specification:ubl:schema:xsd:Invoice-2",
        "cac": "urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2",
        "cbc": "urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2",
    }

    def _find_text(element, path: str, default: str = "") -> str:
        if element is None:
            return default
        found = element.find(path, ns)
        if found is not None and found.text:
            return found.text.strip()
        return default

    # Extract high-level invoice metadata
    invoice_id = _find_text(root, "cbc:ID")
    if not invoice_id:
        # Fallback to local name search if namespace mismatch
        for child in root:
            if child.tag.endswith("ID"):
                invoice_id = child.text.strip() if child.text else ""
                break
    if not invoice_id:
        raise PeppolParseError("Missing mandatory Peppol invoice ID (cbc:ID)")

    issue_date = _find_text(root, "cbc:IssueDate")
    due_date = _find_text(root, "cbc:DueDate") or issue_date
    currency = _find_text(root, "cbc:DocumentCurrencyCode", "USD")

    # Supplier Information
    supplier_party = root.find("cac:AccountingSupplierParty/cac:Party", ns)
    supplier_tax_id = _find_text(supplier_party, "cac:PartyTaxScheme/cbc:CompanyID")
    supplier_name = _find_text(supplier_party, "cac:PartyLegalEntity/cbc:RegistrationName")

    # Buyer Information
    customer_party = root.find("cac:AccountingCustomerParty/cac:Party", ns)
    customer_tax_id = _find_text(customer_party, "cac:PartyTaxScheme/cbc:CompanyID")
    customer_name = _find_text(customer_party, "cac:PartyLegalEntity/cbc:RegistrationName")

    # Monetary Totals
    monetary_total = root.find("cac:LegalMonetaryTotal", ns)
    payable_amount_str = _find_text(monetary_total, "cbc:PayableAmount", "0.0")
    try:
        payable_amount = float(payable_amount_str)
    except ValueError:
        raise PeppolParseError(f"Invalid monetary payable amount: {payable_amount_str}")

    if payable_amount <= 0:
        raise PeppolParseError("Payable amount must be strictly greater than zero")

    # Invoice Line Items (normalized digests)
    lines = []
    for line in root.findall("cac:InvoiceLine", ns):
        line_id = _find_text(line, "cbc:ID")
        qty = _find_text(line, "cbc:InvoicedQuantity", "1.0")
        line_amount = _find_text(line, "cbc:LineExtensionAmount", "0.0")
        item_name = _find_text(line, "cac:Item/cbc:Name", "Trade Receivable Item")
        lines.append({
            "line_id": line_id,
            "quantity": float(qty) if qty else 1.0,
            "amount": float(line_amount) if line_amount else 0.0,
            "description": item_name,
        })

    # Normalized canonical dictionary representation
    return {
        "peppol_specification": "urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0",
        "invoice_id": invoice_id,
        "issue_date": issue_date,
        "due_date": due_date,
        "currency": currency.upper(),
        "payable_amount": payable_amount,
        "supplier": {
            "tax_id": supplier_tax_id,
            "legal_name": supplier_name,
        },
        "buyer": {
            "tax_id": customer_tax_id,
            "legal_name": customer_name,
        },
        "line_items": lines,
    }


def normalize_peppol_invoice(xml_content: str) -> Tuple[Dict[str, Any], bytes, str]:
    """
    End-to-end normalization:
    1. Safely parses XML.
    2. Applies RFC 8785 Canonicalization.
    3. Computes 32-byte SHA-256 identifier digest.
    Returns (normalized_dict, canonical_bytes, hex_hash).
    """
    parsed = parse_peppol_bis3_xml(xml_content)
    canon_bytes = rfc8785_canonicalize(parsed)
    _, hex_hash = compute_canonical_hash(canon_bytes)
    return parsed, canon_bytes, hex_hash


def generate_sample_peppol_xml(
    invoice_id: str = "INV-2026-0091",
    supplier_tax: str = "IN-GST-27AABCM9999Z1Z",
    supplier_name: str = "Sovereign Maritime Exports Ltd",
    buyer_tax: str = "DE-VAT-998877665",
    buyer_name: str = "EuroLogistics GmbH",
    payable_amount: float = 150000.0,
    due_date: str = "2026-11-30"
) -> str:
    """Utility to generate a standardized Peppol BIS 3.0 test XML invoice."""
    return f"""<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
         xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
         xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">
    <cbc:CustomizationID>urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0</cbc:CustomizationID>
    <cbc:ID>{invoice_id}</cbc:ID>
    <cbc:IssueDate>2026-10-01</cbc:IssueDate>
    <cbc:DueDate>{due_date}</cbc:DueDate>
    <cbc:InvoiceTypeCode>380</cbc:InvoiceTypeCode>
    <cbc:DocumentCurrencyCode>USD</cbc:DocumentCurrencyCode>
    <cac:AccountingSupplierParty>
        <cac:Party>
            <cac:PartyTaxScheme>
                <cbc:CompanyID>{supplier_tax}</cbc:CompanyID>
                <cac:TaxScheme><cbc:ID>VAT</cbc:ID></cac:TaxScheme>
            </cac:PartyTaxScheme>
            <cac:PartyLegalEntity>
                <cbc:RegistrationName>{supplier_name}</cbc:RegistrationName>
            </cac:PartyLegalEntity>
        </cac:Party>
    </cac:AccountingSupplierParty>
    <cac:AccountingCustomerParty>
        <cac:Party>
            <cac:PartyTaxScheme>
                <cbc:CompanyID>{buyer_tax}</cbc:CompanyID>
                <cac:TaxScheme><cbc:ID>VAT</cbc:ID></cac:TaxScheme>
            </cac:PartyTaxScheme>
            <cac:PartyLegalEntity>
                <cbc:RegistrationName>{buyer_name}</cbc:RegistrationName>
            </cac:PartyLegalEntity>
        </cac:Party>
    </cac:AccountingCustomerParty>
    <cac:LegalMonetaryTotal>
        <cbc:LineExtensionAmount>{payable_amount:.2f}</cbc:LineExtensionAmount>
        <cbc:TaxExclusiveAmount>{payable_amount:.2f}</cbc:TaxExclusiveAmount>
        <cbc:TaxInclusiveAmount>{payable_amount:.2f}</cbc:TaxInclusiveAmount>
        <cbc:PayableAmount>{payable_amount:.2f}</cbc:PayableAmount>
    </cac:LegalMonetaryTotal>
    <cac:InvoiceLine>
        <cbc:ID>1</cbc:ID>
        <cbc:InvoicedQuantity unitCode="EA">1</cbc:InvoicedQuantity>
        <cbc:LineExtensionAmount>{payable_amount:.2f}</cbc:LineExtensionAmount>
        <cac:Item>
            <cbc:Name>Export Grade Industrial Microprocessors (Batch A-9)</cbc:Name>
        </cac:Item>
    </cac:InvoiceLine>
</Invoice>"""
