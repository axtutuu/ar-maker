/*
 * EXIF情報を元に写真の90度回転問題を補正する関数群
 * Exifの取得は以下のライブラリで行う (画像の変換はクラッシュすることがあるのでこちらの関数で行う)
 * https://github.com/blueimp/JavaScript-Load-Image
 * usage:
 *    FileAPIからDataUrlの取得 -> EXIF情報からOrientationの取得 -> 情報を元にCanvasで回転処理 -> Base64からBlobへ変換という順で行う
 * Ref:
 *   Blob変換などの処理は以下を参考に
 *   dataURIToBlob: https://github.com/graingert/datauritoblob/blob/master/dataURItoBlob.js
 *   rotateByOrientation:
 *      https://github.com/koba04/canvas-exif-orientation/blob/master/index.js#L26-L80
 *      orientation(P28): http://www.cipa.jp/std/documents/j/DC-008-2012_J.pdf
 */
export function dataURIToBlob(dataURI) {
    const mimetype = (dataURI.match(/^data\:([^\;]+)\;base64,/) || [])[1] || '' // e.g. 'data:image/jpeg;base64,...' => 'image/jpeg'
    const byteString = atob(dataURI.split(',')[1])
    const ab = new ArrayBuffer(byteString.length)
    const dw = new DataView(ab)
    for (let i = 0; i < byteString.length; i++) {
        dw.setUint8(i, byteString.charCodeAt(i))
    }
    return new Blob([ab], {type: mimetype})
}

export function rotateByOrientation(imgDataURL, orientation) {
    const img = new Image()
    img.src = imgDataURL

    return new Promise((resolve) => {
        img.onload = resolve
    })
    .then(() => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const mimetype = (imgDataURL.match(/^data\:([^\;]+)\;base64,/) || [])[1] || ''

        canvas.width = img.width
        canvas.height = img.height
        ctx.save()

        switch (orientation) {
            case 2:
                ctx.translate(img.width, 0)
                ctx.scale(-1, 1)
                break
            case 3:
                ctx.translate(img.width, img.height)
                ctx.rotate(180 / 180 * Math.PI)
                break
            case 4:
                ctx.translate(0, img.height)
                ctx.scale(1, -1)
                break
            case 5:
                canvas.width = img.height
                canvas.height = img.width
                ctx.rotate(90 / 180 * Math.PI)
                ctx.scale(1, -1)
                break
            case 6:
                canvas.width = img.height
                canvas.height = img.width
                ctx.rotate(90 / 180 * Math.PI)
                ctx.translate(0, -img.height)
                break
            case 7:
                canvas.width = img.height
                canvas.height = img.width
                ctx.rotate(270 / 180 * Math.PI)
                ctx.translate(-img.width, img.height)
                ctx.scale(1, -1)
                break
            case 8:
                canvas.width = img.height
                canvas.height = img.width
                ctx.translate(0, img.width)
                ctx.rotate(270 / 180 * Math.PI)
                break
        }

        ctx.drawImage(img, 0, 0, img.width, img.height)
        ctx.restore()

        return Promise.resolve(canvas.toDataURL(mimetype))
    })
}
