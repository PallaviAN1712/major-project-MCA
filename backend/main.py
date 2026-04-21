from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import List
import smtplib
from email.mime.text import MIMEText

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

employees_db = []

@app.get("/")
def home():
    return {"message": "Backend running 🚀"}

@app.get("/employees")
def get_employees():
    return employees_db

@app.post("/employees")
def add_employee(emp: Employee):
    employees_db.append(emp)
    return {"message": "Employee added"}

@app.delete("/employees/{index}")
def delete_employee(index: int):
    if index < len(employees_db):
        employees_db.pop(index)
        return {"message": "Deleted"}
    return {"error": "Invalid index"}

# =========================
# 📌 EMAIL MODULE (STABLE)
# =========================

class Email(BaseModel):
    to: List[EmailStr]
    subject: str
    message: str

emails_db = []

# 🔐 YOUR EMAIL CONFIG
SENDER_EMAIL = "n24gowda17@gmail.com"
SENDER_PASSWORD = "hxclpebnbkbrvays"   # no spaces

@app.post("/send-email")
def send_email(email: Email):
    server = None

    try:
        print("\n📤 Connecting to Gmail SMTP...")

        # ✅ Create connection
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.ehlo()
        server.starttls()
        server.ehlo()

        print("🔐 Logging in...")
        server.login(SENDER_EMAIL, SENDER_PASSWORD)

        sent_count = 0
        failed = []

        # ✅ Send to all emails
        for receiver in email.to:
            try:
                print(f"➡ Sending to: {receiver}")

                msg = MIMEText(email.message)
                msg["Subject"] = email.subject
                msg["From"] = f"SaaS App <{SENDER_EMAIL}>"
                msg["To"] = receiver

                server.sendmail(SENDER_EMAIL, receiver, msg.as_string())
                sent_count += 1

                print(f"✅ Sent to {receiver}")

            except Exception as inner_error:
                print(f"❌ Failed for {receiver}: {inner_error}")
                failed.append(receiver)

        emails_db.append(email)

        return {
            "message": f"{sent_count} email(s) sent successfully 🚀",
            "failed": failed,
            "total_sent": len(emails_db)
        }

    except Exception as e:
        print("❌ ERROR:", e)

        return {
            "error": str(e),
            "message": "Email failed ❌"
        }

    finally:
        try:
            if server:
                server.quit()
        except:
            pass

# 📥 EMAIL HISTORY
@app.get("/emails")
def get_emails():
    return emails_db

# =========================
# 📌 SOCIAL MEDIA MODULE
# =========================

class SocialPost(BaseModel):
    content: str

social_db = []

@app.post("/post-social")
def post_social(post: SocialPost):
    try:
        print(f"📢 Posting: {post.content}")

        social_db.append(post.content)

        return {
            "message": "Post ready to share 🚀",
            "content": post.content,
            "share_url": f"https://twitter.com/intent/tweet?text={post.content}"
        }

    except Exception as e:
        return {"error": str(e)}

@app.get("/social-posts")
def get_social_posts():
    return social_db