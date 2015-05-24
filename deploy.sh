#!/usr/bin/env bash
set -e

rsync -ahvc ./* gouda@blopker.com:public/dev/contrast
