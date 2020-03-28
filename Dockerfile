FROM python:3.7-alpine

ADD api/requirements.txt /api/requirements.txt

RUN set -ex \
    && apk update \
    && apk add --no-cache --virtual .build-deps \
    postgresql-dev \
    build-base \
    && python -m venv /env \
    && /env/bin/pip install --upgrade pip \
    && /env/bin/pip install --no-cache-dir -r /api/requirements.txt \
    && runDeps="$(scanelf --needed --nobanner --recursive /env \
    | awk '{ gsub(/,/, "\nso:", $2); print "so:" $2 }' \
    | sort -u \
    | xargs -r apk info --installed \
    | sort -u)" \
    && apk add --no-cache --virtual .rundeps $runDeps \
    nginx \
    npm \
    && apk del .build-deps

RUN mkdir /run/nginx

ADD ui /ui
WORKDIR /ui
RUN set -ex \
    && npm i \
    && npm run build \
    && mkdir -p /nginx/static \
    && mv build/static/* /nginx/static/ \
    && rm -r build/static \
    && rm -rf node_modules


ENV VIRTUAL_ENV /env
ENV PATH /env/bin:$PATH

ADD nginx /nginx

ADD api /api
WORKDIR /api
RUN python manage.py collectstatic \
    && mv static/* /nginx/static/

    

WORKDIR /

EXPOSE 80

CMD cd /api \
    && gunicorn --bind :8000 --workers 3 api.wsgi:application \
    && nginx -c /nginx/nginx.conf