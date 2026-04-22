from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import List
import smtplib
from email.mime.text import MIMEText

# ✅ DATABASE IMPORTS
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker

# =========================
# 📌 DATABASE SETUP
# =========================

DATABASE_URL = "sqlite:///./app.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)

Base = declarative_base()

# =========================
# 📌 TABLES
# =========================

class EmployeeModel(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    time = Column(String)
    status = Column(String)


class EmailModel(Base):
    __tablename__ = "emails"

    id = Column(Integer, primary_key=True, index=True)
    to = Column(String)
    subject = Column(String)
    message = Column(String)


class SocialModel(Base):
    __tablename__ = "social"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(String)

# ✅ CREATE DATABASE
Base.metadata.create_all(bind=engine)

# =========================

app = FastAPI()

# ✅ CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# 📌 ATTENDANCE MODULE
# =========================

class Employee(BaseModel):
    name: str
    time: str
    status: str


@app.get("/")
def home():
    return {"message": "Backend running 🚀"}


@app.get("/employees")
def get_employees():
    db = SessionLocal()
    data = db.query(EmployeeModel).all()
    db.close()
    return data


@app.post("/employees")
def add_employee(emp: Employee):
    db = SessionLocal()

    new_emp = EmployeeModel(
        name=emp.name,
        time=emp.time,
        status=emp.status
    )

    db.add(new_emp)
    db.commit()
    db.close()

    return {"message": "Employee added"}


@app.delete("/employees/{id}")
def delete_employee(id: int):
    db = SessionLocal()
    emp = db.query(EmployeeModel).filter(EmployeeModel.id == id).first()

    if emp:
        db.delete(emp)
        db.commit()
        db.close()
        return {"message": "Deleted"}

    db.close()
    return {"error": "Invalid id"}

# =========================
# 📌 EMAIL MODULE (STABLE + DB)
# =========================

class Email(BaseModel):
    to: List[EmailStr]
    subject: str
    message: str


SENDER_EMAIL = "n24gowda17@gmail.com"
SENDER_PASSWORD = "hxclpebnbkbrvays"


@app.post("/send-email")
def send_email(email: Email):
    server = None

    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.ehlo()
        server.starttls()
        server.ehlo()

        server.login(SENDER_EMAIL, SENDER_PASSWORD)

        sent_count = 0
        failed = []

        for receiver in email.to:
            try:
                msg = MIMEText(email.message)
                msg["Subject"] = email.subject
                msg["From"] = f"SaaS App <{SENDER_EMAIL}>"
                msg["To"] = receiver

                server.sendmail(SENDER_EMAIL, receiver, msg.as_string())
                sent_count += 1

            except Exception as inner_error:
                failed.append(receiver)

        # ✅ SAVE TO DATABASE
        db = SessionLocal()
        data = EmailModel(
            to=",".join(email.to),
            subject=email.subject,
            message=email.message
        )
        db.add(data)
        db.commit()
        db.close()

        return {
            "message": f"{sent_count} email(s) sent successfully 🚀",
            "failed": failed
        }

    except Exception as e:
        return {"error": str(e)}

    finally:
        if server:
            server.quit()


@app.get("/emails")
def get_emails():
    db = SessionLocal()
    data = db.query(EmailModel).all()
    db.close()
    return data

# =========================
# 📌 SOCIAL MEDIA MODULE (DB)
# =========================

class SocialPost(BaseModel):
    content: str


@app.post("/post-social")
def post_social(post: SocialPost):
    try:
        db = SessionLocal()

        new_post = SocialModel(content=post.content)
        db.add(new_post)
        db.commit()
        db.close()

        return {
            "message": "Post saved permanently 🚀",
            "content": post.content,
            "share_url": f"https://twitter.com/intent/tweet?text={post.content}"
        }

    except Exception as e:
        return {"error": str(e)}


@app.get("/social-posts")
def get_social_posts():
    db = SessionLocal()
    data = db.query(SocialModel).all()
    db.close()
    return data