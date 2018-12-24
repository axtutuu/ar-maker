export default function threejs(image) {
  //===================================================================
  // three.js setting
  //===================================================================

  const scene = new THREE.Scene();                        // シーンの作成
  const renderer = new THREE.WebGLRenderer({              // レンダラの作成
    antialias: true,                                    // アンチエイリアス有効
    alpha: true,                                        // canvasに透明度バッファを持たせる
    preserveDrawingBuffer: true,
  });
  renderer.setClearColor(new THREE.Color("black"), 0);  // レンダラの背景色
  renderer.setSize(640, 480);                           // レンダラのサイズ
  renderer.domElement.style.position = "absolute";      // レンダラの位置は絶対値
  renderer.domElement.style.top = "0px";                // レンダラの上端
  renderer.domElement.style.left = "0px";               // レンダラの左端
  const dom = document.querySelector('.ar')
  dom.appendChild(renderer.domElement);       // レンダラの DOM を body に入れる
  const camera = new THREE.Camera();                      // カメラの作成
  scene.add(camera);                                    // カメラをシーンに追加
  const light = new THREE.DirectionalLight(0xffffff);     // 平行光源（白）を作成
  light.position.set(0, 0, 2);                          // カメラ方向から照らす
  scene.add(light);                                     // シーンに光源を追加

  //===================================================================
  // arToolkitSource（マーカトラッキングするメディアソース）
  //===================================================================
  const source = new THREEx.ArToolkitSource({             // arToolkitSourceの作成
    sourceType: "webcam",                               // Webカメラを使う（スマホもこれでOK）
  });
  source.init(function onReady() {                      // ソースを初期化し、準備ができたら
    onResize();                                         // リサイズ処理
  });

  //===================================================================
  // arToolkitContext（カメラパラメータ、マーカ検出設定）
  //===================================================================
  const context = new THREEx.ArToolkitContext({           // arToolkitContextの作成
    debug: false,                                       // デバッグ用キャンバス表示（デフォルトfalse）
    cameraParametersUrl: "/public/js/data/camera_para.dat",             // カメラパラメータファイル
    detectionMode: "mono",                              // 検出モード（color/color_and_matrix/mono/mono_and_matrix）
    imageSmoothingEnabled: true,                        // 画像をスムージングするか（デフォルトfalse）
    maxDetectionRate: 60,                               // マーカの検出レート（デフォルト60）
    canvasWidth: source.parameters.sourceWidth,         // マーカ検出用画像の幅（デフォルト640）
    canvasHeight: source.parameters.sourceHeight,       // マーカ検出用画像の高さ（デフォルト480）
  });
  context.init(function onCompleted(){                  // コンテクスト初期化が完了したら
    camera.projectionMatrix.copy(context.getProjectionMatrix());   // 射影行列をコピー
  });

  //===================================================================
  // リサイズ処理
  //===================================================================
  window.addEventListener("resize", function() {        // ウィンドウがリサイズされたら
    onResize();                                         // リサイズ処理
  });
  // リサイズ関数
  function onResize(){
    source.onResizeElement();                           // トラッキングソースをリサイズ
    source.copyElementSizeTo(renderer.domElement);      // レンダラも同じサイズに
    if(context.arController !== null){                  // arControllerがnullでなければ
      source.copyElementSizeTo(context.arController.canvas);  // それも同じサイズに
    } 
  }

  //===================================================================
  // ArMarkerControls（マーカと、マーカ検出時の表示オブジェクト）
  //===================================================================
  //-------------------------------
  // その１（hiroマーカ＋立方体）
  //-------------------------------
  // マーカ
  // ネットでhiroマーカの画像を得て、以下の AR.js のマーカトレーニングサイトで patt を作成
  // https://jeromeetienne.github.io/AR.js/three.js/examples/marker-training/examples/generator.html
  const marker1 = new THREE.Group();                    // マーカをグループとして作成
  const controls = new THREEx.ArMarkerControls(context, marker1, {    // マーカを登録
    type: "pattern",                                    // マーカのタイプ
    patternUrl: "/public/js/data/patt.hiro",            // マーカファイル
  });
  scene.add(marker1);                                   // マーカをシーンに追加
  // モデル（メッシュ）
  // const geo = new THREE.CubeGeometry(1, 1, 1);          // cube ジオメトリ（サイズは 1x1x1）
  const geo = new THREE.SphereGeometry( 1.1, 12, 12, 0, Math.PI * 2, 0, Math.PI)
  // const mat = new THREE.MeshNormalMaterial({            // マテリアルの作成
  //   transparent: true,                                  // 透過
  //   opacity: 1,                                         // 不透明度
  // });
  
  const loader = new THREE.TextureLoader();
  const texture = loader.load(image);
  const mat = new THREE.MeshLambertMaterial( {
      map: texture
  });
  
  const mesh1 = new THREE.Mesh(geo, mat);               // メッシュを生成
  mesh1.name = "cube";                                  // メッシュの名前（後でピッキングで使う）
  mesh1.position.set(0, 1.5, 0);                        // 初期位置
  marker1.add(mesh1);                                   // メッシュをマーカに追加
  
  // マーカ隠蔽（cloaking）
  const videoTex = new THREE.VideoTexture(source.domElement);  // 映像をテクスチャとして取得
  videoTex.minFilter = THREE.NearestFilter;             // 映像テクスチャのフィルタ処理
  const cloak = new THREEx.ArMarkerCloak(videoTex);       // マーカ隠蔽(cloak)オブジェクト
  cloak.object3d.material.uniforms.opacity.value = 1.0; // cloakの不透明度
  marker1.add(cloak.object3d);                          // cloakをマーカに追加
  
  //===================================================================
  // レンダリング・ループ
  //===================================================================
  function renderScene() {                              // レンダリング関数
    requestAnimationFrame(renderScene);                 // ループを要求
    if(source.ready === false)    { return; }             // メディアソースの準備ができていなければ抜ける
    context.update(source.domElement);                  // ARToolkitのコンテキストを更新
    renderer.render(scene, camera);                     // レンダリング実施
  }
  renderScene();                                        // 最初に1回だけレンダリングをトリガ
}
