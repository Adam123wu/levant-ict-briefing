#!/usr/bin/env python3
"""Create a Telegram StringSession locally without exposing login secrets."""

from __future__ import annotations

import asyncio
import getpass
import os
from pathlib import Path

from telethon import TelegramClient
from telethon.errors import SessionPasswordNeededError
from telethon.sessions import StringSession


OUTPUT = Path(".secrets/telegram.env")


def required_value(name: str, prompt: str, *, secret: bool = False) -> str:
    value = os.environ.get(name, "").strip()
    if value:
        return value
    reader = getpass.getpass if secret else input
    value = reader(prompt).strip()
    if not value:
        raise SystemExit(f"{name} 不能为空")
    return value


async def authorize() -> None:
    api_id_text = required_value("TG_API_ID", "TG_API_ID: ")
    if not api_id_text.isdigit():
        raise SystemExit("TG_API_ID 必须是数字")
    api_hash = required_value("TG_API_HASH", "TG_API_HASH（输入隐藏）: ", secret=True)
    phone = required_value("TG_PHONE", "Telegram 手机号（含国家代码，仅本次使用）: ")

    client = TelegramClient(StringSession(), int(api_id_text), api_hash)
    await client.connect()
    try:
        sent = await client.send_code_request(phone)
        code = getpass.getpass("Telegram 登录验证码（输入隐藏，不会保存）: ").strip()
        try:
            await client.sign_in(phone=phone, code=code, phone_code_hash=sent.phone_code_hash)
        except SessionPasswordNeededError:
            password = getpass.getpass("Telegram 二步验证密码（输入隐藏，不会保存）: ")
            await client.sign_in(password=password)

        me = await client.get_me()
        session = client.session.save()
        if not session:
            raise SystemExit("未能生成 Telegram 会话")

        OUTPUT.parent.mkdir(parents=True, exist_ok=True)
        OUTPUT.write_text(
            f"TG_API_ID={api_id_text}\nTG_API_HASH={api_hash}\nTG_SESSION={session}\n",
            encoding="utf-8",
        )
        OUTPUT.chmod(0o600)
        display_name = " ".join(part for part in [me.first_name, me.last_name] if part) or str(me.id)
        print(f"授权成功：{display_name}")
        print(f"凭据已写入 {OUTPUT}（权限 600，已被 git 忽略）")
        print("下一步运行：gh secret set -f .secrets/telegram.env -R Adam123wu/levant-ict-briefing")
    finally:
        await client.disconnect()


if __name__ == "__main__":
    asyncio.run(authorize())
