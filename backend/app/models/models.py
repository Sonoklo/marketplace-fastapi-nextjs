from app.db.database import Base
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Table
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

item_categories = Table(
    "item_categories",
    Base.metadata,
    Column("item_id", Integer, ForeignKey("items.id", ondelete="CASCADE"), primary_key=True),
    Column("category_id", Integer, ForeignKey("categories.id", ondelete="CASCADE"), primary_key=True),
)


class Account(Base):
    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(20), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)

    bookmarks = relationship("Bookmark", back_populates="buyer", cascade="all, delete-orphan")
    created_items = relationship("Item", back_populates="creator", cascade="all, delete-orphan")
    purchases = relationship("Purchase", back_populates="buyer", cascade="all, delete-orphan")

    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)


class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(String(1000), default=None, nullable=True)
    count = Column(Integer, default=1, nullable=False)
    price = Column(Float, nullable=False)
    user_id = Column(Integer, ForeignKey("accounts.id", ondelete="CASCADE"), nullable=False)

    bookmarks = relationship("Bookmark", back_populates="item", cascade="all, delete-orphan")
    categories = relationship("Category", secondary=item_categories, back_populates="items")
    creator = relationship("Account", back_populates="created_items")
    purchases = relationship("Purchase", back_populates="item", cascade="all, delete-orphan")


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)

    items = relationship("Item", secondary=item_categories, back_populates="categories")


class Purchase(Base):
    __tablename__ = "purchases"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    account_id = Column(Integer, ForeignKey("accounts.id", ondelete="CASCADE"), nullable=False)
    item_id = Column(Integer, ForeignKey("items.id", ondelete="CASCADE"), nullable=False)
    price = Column(Float, nullable=False)
    count = Column(Integer, nullable=False, default=1)

    buyer = relationship("Account", back_populates="purchases")
    item = relationship("Item", back_populates="purchases")

    created_at = Column(DateTime, server_default=func.now(), nullable=False)

class Bookmark(Base):
    __tablename__ = "bookmarks"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    account_id = Column(Integer, ForeignKey("accounts.id", ondelete="CASCADE"), nullable=False)
    item_id = Column(Integer, ForeignKey("items.id", ondelete="CASCADE"), nullable=False)

    buyer = relationship("Account", back_populates="bookmarks")
    item = relationship("Item", back_populates="bookmarks")

    created_at = Column(DateTime, server_default=func.now(), nullable=False)