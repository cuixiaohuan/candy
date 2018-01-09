echo remove last build
rm -rf ./fepack-temp

echo build
fepack release qa

echo change uploader aurora dir
sed -i -e 's/="\/candy/="../g' ./fepack-temp/candy/tests/button.html
sed -i -e 's/="\/candy/="../g' ./fepack-temp/candy/tests/slider.html

echo done
