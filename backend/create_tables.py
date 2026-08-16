from database import engine, Base
from models import Document, AIQuery, Case


print("Creating missing database tables...")

Base.metadata.create_all(bind=engine)

print("Database tables are ready.")
