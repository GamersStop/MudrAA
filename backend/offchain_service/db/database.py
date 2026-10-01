"""
MudrAA Offchain Relayer - Database Connection & Engine Configuration
Adheres to rule.md: High-performance async I/O, connection pooling, and resilient fallbacks.
"""

import os
from typing import AsyncGenerator
from contextlib import asynccontextmanager
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlmodel import SQLModel

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+asyncpg://mudraa_admin:mudraa_dev_password@localhost:5432/mudraa_trade"
)

# Convert standard postgres:// or postgresql:// to asyncpg driver dialect if needed
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)
elif DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+asyncpg://", 1)

# Configure engine arguments based on driver
engine_kwargs = {
    "echo": os.getenv("SQL_DEBUG", "false").lower() == "true",
    "future": True,
}

if "asyncpg" in DATABASE_URL:
    # High-throughput production connection pool configuration (rule.md Section 3.2)
    engine_kwargs.update({
        "pool_size": int(os.getenv("DB_POOL_SIZE", "20")),
        "max_overflow": int(os.getenv("DB_MAX_OVERFLOW", "10")),
        "pool_recycle": 1800,
        "pool_pre_ping": True,
    })

# Primary Async Engine
engine = create_async_engine(DATABASE_URL, **engine_kwargs)

# Async Session Factory
async_session_maker = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

async def init_db() -> None:
    """Initializes schema and tables if they do not exist."""
    async with engine.begin() as conn:
        # Import models so SQLModel metadata registers all entities
        import db.models  # noqa: F401
        await conn.run_sync(SQLModel.metadata.create_all)

async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI dependency for obtaining an isolated async database session."""
    async with async_session_maker() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

async def check_db_health() -> bool:
    """Verifies that the database pool is reachable and healthy."""
    try:
        from sqlalchemy import text
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))
        return True
    except Exception:
        return False

async def close_db() -> None:
    """Gracefully closes all connections in the pool."""
    await engine.dispose()
