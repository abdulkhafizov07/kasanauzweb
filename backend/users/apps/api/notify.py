import threading

import requests

# from django.conf import settings


class NotifyMe:
    def __init__(self):
        self.login = "muxtoriddin.erkinboyev@gmail.com"  # settings.ESKIZ_LOGIN
        self.password = "YAnlWLmbSVULnlFdycDGrPCo6uIUVCkq71eX8irh"  # settings.ESKIZ_PASSWORD
        self.token = None
        self.headers = {}

    def do_login(self):
        response = requests.post("https://notify.eskiz.uz/api/auth/login", data={"email": self.login, "password": self.password})
        json_data = response.json()

        if response.status_code == 200:
            self.token = json_data["data"]["token"]
            self.headers = {"Authorization": f"Bearer {self.token}"}

    def do_check(self):
        response = requests.get("https://notify.eskiz.uz/api/auth/user", headers=self.headers)
        json_data = response.json()
        if response.status_code == 200:
            return json_data["data"]["email"] == self.login
        return False

    def send_message(self, phone: str, text: str, callback: str):
        def main(*args):
            if not self.do_check():
                self.do_login()

            requests.post(
                "https://notify.eskiz.uz/api/message/sms/send",
                headers=self.headers,
                data={
                    "mobile_phone": "".join([i for i in args[0] if i.isdigit()]),
                    "message": args[1],
                    "from": "kasana.mehnat.uz",
                    "callback_url": args[2],
                },
            )

        t = threading.Thread(None, target=main, args=(phone, text, callback))
        t.start()


notify = NotifyMe()

# notify.send_message("+998999045576", "kasana.mehnat.uz saytiga ro‘yxatdan o‘tish uchun tasdiqlash kodi: 43523", "localhost:3000")
