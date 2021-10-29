FROM python:3.8.12

# set work directory
WORKDIR /usr/src/app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install dependencies
# COPY pip.conf /etc
RUN pip install -i https://pypi.douban.com/simple --upgrade pip
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt -i https://pypi.douban.com/simple --extra-index-url https://mirrors.aliyun.com/pypi/simple
# RUN pip install --no-cache-dir -r requirements.txt
