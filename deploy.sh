#!/usr/bin/env bash
set -e

rsync -ahvc ./* static@blopker.com:public/dev/contrast
