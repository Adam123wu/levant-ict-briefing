#!/usr/bin/env python3
"""Authorize Telegram locally and upload encrypted GitHub Actions secrets."""

from __future__ import annotations

import asyncio
import argparse
import getpass
import os
import shutil
import subprocess

from telethon import TelegramClient
from telethon.errors import SessionPasswordNeededError
from telethon.sessions import StringSession


DEFAULT_REPOSITORY = "Adam123wu/levant-ict-briefing"


def required_value(name: str, prompt: str, *, secret: bool = False) -> str:
    value = os.environ.get(name, "").strip()
    if value:
        return value
    reader = getpass.getpass if secret else input
    value = reader(prompt).strip()
    if not value:
        raise SystemExit(f"{name} 不能为空")
    return value


def upload_secrets(repository: str, api_id: str, api_hash: str, session: str) -> None:
    if not shutil.which("gh"):
        raise SystemExit("未找到 GitHub CLI（gh），无法安全写入 GitHub Actions Secrets")
    payload = f"TG_API_ID={api_id}\nTG_API_HASH={api_hash}\nTG_SESSION={session}\n"
    result = subprocess.run(
        ["gh", "secret", "set", "-f", "-", "-R", repository],
        input=payload,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        check=False,
    )
    if result.returncode != 0:
        raise SystemExit("GitHub Secret 写入失败。请确认 gh 已登录且你拥有仓库管理权限。")


async def authorize(repository: str) -> None:
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

        upload_secrets(repository, api_id_text, api_hash, session)
        display_name = " ".join(part for part in [me.first_name, me.last_name] if part) or str(me.id)
        print(f"授权成功：{display_name}")
        print(f"TG_API_ID、TG_API_HASH、TG_SESSION 已加密写入 GitHub Actions Secrets：{repository}")
        print("本机未创建明文凭据文件。现在可以手动触发 telegram-refresh.yml。")
    finally:
        await client.disconnect()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="安全授权 Telegram 并写入 GitHub Actions Secrets")
    parser.add_argument("--repo", default=DEFAULT_REPOSITORY, help="GitHub owner/repository")
    args = parser.parse_args()
    asyncio.run(authorize(args.repo))
