# fullscreen

[![Netlify Status](https://api.netlify.com/api/v1/badges/4a31cc1f-6aab-4d40-9f9b-7c8debe5f275/deploy-status)](https://app.netlify.com/sites/fullscreen-space/deploys)

Source code for the [fullscreen.space](https://fullscreen.space) website.

![](https://raw.githubusercontent.com/interalia-studio/fullscreen/main/src/assets/images/logo-bmbf.svg?sanitize=true&token=GHSAT0AAAAAABRLRQLK5ODVLLSCJXSYWH6OYQ6F6EQ)
![](https://raw.githubusercontent.com/interalia-studio/fullscreen/main/src/assets/images/logo-okfn.svg?sanitize=true&token=GHSAT0AAAAAABRLRQLLKPSSWQCRZ65QISQ6YQ6F6UQ)

## Distribution

```
npm run build:tauri
```

The universal dmg will be created at:

```
./src-tauri/target/universal-apple-darwin/release/bundle/dmg/Fullscreen_x.x.x_universal.dmg
```

You may need to install the following runtime:

```
rustup target add x86_64-apple-darwin
```


## License

Fullscreen is licensed under [AGPLv3](./LICENSE).

The Urbanist font is licensed under the [Open Font License](licenses/OFL.txt).
