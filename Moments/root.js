// "use strict";

class DOM extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      created: false,
      content: "",
      imgs: [],
      userName: "",
      heartsCount: "",
      commentsCount: "",
      WeChatHead: []
    };
    this.comments = [
      {
        img: "./img/head/24.jpg",
        name: "周华",
        time: "",
        detail: "可爱！"
      }
    ];
    this.uploadImage = [];
    this.uploadImageState = true;
    this.uploadWeChatImage = [];
    this.uploadWeChatImageState = true;
  }

  doneCallback = () => {
    this.setState({ created: false });
  };

  onChangeContent = ev => {
    this.setState({
      content: ev.currentTarget.value
    });
  };

  uploadImageSuccess = (state, data) => {
    let imgs = [];
    if (data.length > 0) {
      data.forEach(item => {
        imgs.push({
          base64code: item.base64code,
          type: item.type
        });
      });
    }
    this.uploadImage = data;
    this.uploadImageState = state;
    this.setState({ imgs: imgs });
  };

  onChangeUserName = ev => {
    this.setState({
      userName: ev.currentTarget.value
    });
  };

  // 用户上传微信头像
  uploadWeChatImageSuccess = (state, data) => {
    let imgs = [];
    if (data.length > 0) {
      data.forEach(item => {
        imgs.push({
          base64code: item.base64code,
          type: item.type
        });
      });
    }
    this.uploadWeChatImage = data;
    this.uploadWeChatImageState = state;
    this.setState({ WeChatHead: imgs });
  };

  onChangeHeartsCount = ev => {
    if (ev.currentTarget.value >= 24) {
      return;
    }
    this.setState({
      heartsCount: ev.currentTarget.value
    });
  };

  onChangeCommentsCount = ev => {
    this.setState({
      commentsCount: ev.currentTarget.value
    });
  };

  render() {
    if (!this.state.created) {
      return (
        <div className="root">
          <textarea
            placeholder="这一刻的想法..."
            onChange={this.onChangeContent}
            value={this.state.content}
          ></textarea>
          <div className={`imgsContent`}>
            <UploadImage
              maxSize={9}
              currentDataCallback={this.uploadImageSuccess}
              immediately={false}
              originImgData={this.uploadImage}
              imgStyle={{ height: "110px", width: "110px" }}
            />
          </div>
          <div style={{ marginTop: "40px" }}></div>
          <div className={`input-info`}>
            <label>微信昵称</label>
            <input onChange={this.onChangeUserName} type="text" />
          </div>
          <div className={`input-info uploadImg`}>
            <label>微信头像</label>
            <UploadImage
              maxSize={1}
              currentDataCallback={this.uploadWeChatImageSuccess}
              immediately={false}
              originImgData={this.uploadWeChatImage}
            />
          </div>
          <div className={`input-info`}>
            <label>点赞数量</label>
            <input
              onChange={this.onChangeHeartsCount}
              type="number"
              placeholder="目前最大为28(乱序功能待开发)"
              value={this.state.heartsCount}
            />
          </div>
          <div className={`input-info`}>
            <label>评价数量</label>
            <input
              onChange={this.onChangeCommentsCount}
              type="number"
              placeholder="暂未开发"
            />
          </div>
          <div className={`input-info tip`}>
            在微信中打开，没有header，请使用系统截屏工具<br/>
            在浏览器中打开，请使用全屏模式，再使用系统截屏工具<br/>
            *在朋友圈生成后，点击底部输入框，可返回编辑页面
          </div>
          <div
            className="create"
            onClick={() => this.setState({ created: true })}
          >
            生成朋友圈
          </div>
        </div>
      );
    }

    return (
      <div>
        <WeChat
          content={this.state.content}
          imgArr={this.state.imgs}
          userName={this.state.userName}
          userImg={this.uploadWeChatImage}
          comments={this.comments}
          doneCallback={this.doneCallback}
          heartsCount={this.state.heartsCount}
        />
      </div>
    );
  }
}

class WeChat extends React.Component {
  constructor(props) {
    super(props);
    this.publishTimeObj = new Date();
  }

  // 获取微信展示的时间格式 的 字符串
  getShowTimeStr(dataObj, withYear = false) {
    let str = `${
      withYear ? dataObj.getFullYear() + "年" : ""
    }${dataObj.getMonth() + 1}月${dataObj.getDate()}日 ${
      dataObj.getHours() <= 12
        ? "上午" + dataObj.getHours()
        : "下午" + (dataObj.getHours() - 12)
    }:${
      (dataObj.getMinutes() + "").length == 1
        ? "0" + dataObj.getMinutes()
        : dataObj.getMinutes()
    }`;
    return str;
  }

  // 熏染内容的图片模块
  renderImgBox() {
    let imgs = [];
    if (this.props.imgArr && this.props.imgArr.length == 0) {
      // 当前用户的无图片
    } else if (this.props.imgArr && this.props.imgArr.length == 1) {
      // 当前用户只有一张图片
      imgs.push(
        <img
          className="img-one"
          src={`data:image/${this.props.imgArr[0].type};base64,${this.props.imgArr[0].base64code}`}
          key={0}
          alt=""
        />
      );
    } else if (this.props.imgArr && this.props.imgArr.length > 1) {
      this.props.imgArr.forEach((item, index) => {
        if (index > 8) {
          return;
        }
        imgs.push(
          <img
            className="img-three"
            src={`data:image/${item.type};base64,${item.base64code}`}
            key={index}
            alt=""
          />
        );
      });
    }
    return imgs;
  }

  // 渲染评价模块
  renderComment() {
    let comments = [];
    if (this.props.comments.length == 0) {
      // 无评价内容
      return "";
    } else {
      this.props.comments.forEach((item, index) => {
        comments.push(
          <div className="item" key={index}>
            <img src={item.img} className="head" alt="" />
            <div className="detail">
              <div className="item-info">
                <span className="name">{item.name}</span>
                <span className="time">
                  {this.getShowTimeStr(this.publishTimeObj)}
                </span>
              </div>
              <div className="item-detail">{item.detail}</div>
            </div>
          </div>
        );
      });
    }
    return (
      <div className="comment">
        <div className="arraw"></div>
        <div className="icon">
          <img src="./img/comment.png" alt="" />
        </div>
        <div className="info">{comments}</div>
      </div>
    );
  }

  // 渲染点赞数量的头像
  renderHearts() {
    let hearts = [];
    if (this.props.heartsCount > 0) {
      for (let i = 0; i < this.props.heartsCount; i++) {
        hearts.push(
          <img src={`./img/head/${i + 1}.jpg`} className="head" alt="" />
        );
      }
      return (
        <div className="hearts">
          <div className="arraw"></div>
          <img className="operation" src="./img/operation.png" />
          <div className="icon">
            <img src="./img/heart.png" alt="" />
          </div>
          <div className="person">{hearts}</div>
        </div>
      );
    } else {
      return "";
    }
  }

  // 发布时间渲染
  renderPublishTime() {
    return this.getShowTimeStr(this.publishTimeObj, true);
  }

  // 渲染header
  renderHeadArea() {
    // 判断，在微信浏览器中，不渲染header
    if (window.navigator.userAgent.toLocaleLowerCase().indexOf("micromessenger") < 0) {
      return (
        <div className="header header_1">
          <div className="done" onClick={this.props.doneCallback}>
            完成
          </div>
          详情
        </div>
      );
    }
  }

  render() {
    let arr = [];
    this.props.content
      .split("\n")
      .forEach((item, index) => arr.push(<div key={index}>{item.trim()}</div>));
    return (
      <div className="wechat">
        {this.renderHeadArea()}
        <div id="all" className="container">
          <div className="content">
            <div className="left">
              {/* <img src={this.props.userImguserImg} className="head" alt="" /> */}
              <img
                className="head"
                src={`data:image/${this.props.userImg[0].type};base64,${this.props.userImg[0].base64code}`}
                alt=""
              />
            </div>
            <div className="right">
              <div className="user-name">{this.props.userName}</div>
              <div className="write">{arr}</div>
              <div className="img-box">{this.renderImgBox()}</div>
              <div className="time">
                {this.renderPublishTime()}
                <span className="delete">删除</span>
              </div>
            </div>
          </div>

          {this.renderHearts()}
          {this.renderComment()}
        </div>
        <img className="footer" src="./img/footer.png" onClick={this.props.doneCallback} />
      </div>
    );
  }
}

/**
 * @description 一个H5图片选择的组件，
 * 将<ImageSelecter/>包裹在父元素下，
 * 设置好父元素的大小，我们将占满父元素
 * @author JaiYuen
 * @date 2018-08-07
 * @class ImageSelecter
 * @extends {Component}
 * @param {function}onSelect:成功读取图片的回调，返回成功信息 @example{base64code:图片的base64,size:大小,name:文件名}
 * @param {function}onError:读取文件失败的回调
 * @param {Boolean}able:是否可以选择
 * @param {object}style 自定义样式
 * @param {Boolean}multiple 是否多张上传
 * @param {number}num 一次允许上传多少张 允许多张上传时候，必须
 */
class ImageSelecter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.ids = new Date().getTime();
  }
  /**
   * @description 压缩图片
   * @author Yuan Jie
   * @date 2018-08-07
   * @param {*} img 图片路径
   * @param {number} [width=400] 宽带
   * @param {number} [height=400] 高度
   * @returns {*} 压缩后的图片路径
   */
  compressImg = (img, width = 400, height = 400) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    // 图片原始尺寸
    const originWidth = img.width;
    const originHeight = img.height;

    // 最大尺寸限制，可通过设置宽高来实现图片压缩程度
    const maxWidth = width,
      maxHeight = height;
    // 目标尺寸
    let targetWidth = originWidth,
      targetHeight = originHeight;
    // 图片尺寸超过300x300的限制
    if (originWidth > maxWidth || originHeight > maxHeight) {
      if (originWidth / originHeight > maxWidth / maxHeight) {
        // 更宽，按照宽度限定尺寸
        targetWidth = maxWidth;
        targetHeight = Math.round(maxWidth * (originHeight / originWidth));
      } else {
        targetHeight = maxHeight;
        targetWidth = Math.round(maxHeight * (originWidth / originHeight));
      }
    }
    // canvas对图片进行缩放
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    // 清除画布
    context.clearRect(0, 0, targetWidth, targetHeight);
    // 图片压缩
    context.drawImage(img, 0, 0, targetWidth, targetHeight);
    /*第一个参数是创建的img对象；第二三个参数是左上角坐标，后面两个是画布区域宽高*/

    //压缩后的图片转base64 url
    /*canvas.toDataURL(mimeType, qualityArgument),mimeType 默认值是'image/png';
     * qualityArgument表示导出的图片质量，只有导出为jpeg和webp格式的时候此参数才有效，默认值是0.92*/
    const newUrl = canvas.toDataURL("image/jpeg", 0.92).split(",")[1]; //base64 格式,取 ，后面的东西

    // const img = this.result.split(',')[1];
    // const name = file.name;
    // const size = file.size;
    return {
      base64code: newUrl
      // name: name,
      // size: size
    };
  };
  readSingleFile(file, idx) {
    const { onSelect, onError } = this.props;
    const { compressImg } = this;
    //读取文件，
    const reader = new FileReader();
    reader.readAsDataURL(file);
    const img = document.createElement("img");
    reader.onload = function(e) {
      console.log(2335);
      img.src = e.target.result;
    };
    const { name, size } = file;
    //绑定load事件
    img.onload = function() {
      const obj = compressImg(img);
      if (onSelect)
        onSelect({
          base64code: obj.base64code,
          name: name,
          size: size,
          index: idx
        });
    };
    reader.onerror = function(e) {
      Toast.info("文件读取出错");
      if (onError) {
        onError(idx);
      }
    };
  }
  /**
   * @description 读文件
   * @author Yuan Jie
   * @date 2018-08-07
   * @param {*} files 文件列表
   * @returns {*}
   */
  readFiles = files => {
    if (!files || !files.length) return "";
    files.forEach((file, idx) => {
      this.readSingleFile(file, idx);
    });
  };
  /**
   * @description 用户选取图片后，调用本方法
   * @param {*}e 用户触发事件
   * @returns {*}错误时终止程序继续进行
   */
  readFile = e => {
    //
    const mine = this;
    const file = e.target.files[0];
    //判断类型是不是图片
    if (!/image\/\w+/.test(file.type)) {
      Toast.info("请确保文件为图像类型");
      return false;
    }
    //如果多张上传
    if (this.props.multiple) {
      if (e.target.files.length > this.props.num) {
        // Toast.info(`一次最多上传${this.props.num}张`);
        alert(`一次最多上传${this.props.num}张`);
        return;
      }
      this.readFiles(Array.from(e.target.files));
      e.target.value = "";
      return;
    }
    const reader = new FileReader(),
      //创建一个img对象
      Img = new Image();
    reader.readAsDataURL(file);
    reader.onload = function(e) {
      Img.src = e.target.result;
    };
    Img.onload = function() {
      //压缩图片
      // 缩放图片需要的canvas（也可以在DOM中直接定义canvas标签，这样就能把压缩完的图片不转base64也能直接显示出来）
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      // 图片原始尺寸
      const originWidth = this.width;
      const originHeight = this.height;

      // 最大尺寸限制，可通过设置宽高来实现图片压缩程度
      const maxWidth = 400,
        maxHeight = 400;
      // 目标尺寸
      let targetWidth = originWidth,
        targetHeight = originHeight;
      // 图片尺寸超过300x300的限制
      if (originWidth > maxWidth || originHeight > maxHeight) {
        if (originWidth / originHeight > maxWidth / maxHeight) {
          // 更宽，按照宽度限定尺寸
          targetWidth = maxWidth;
          targetHeight = Math.round(maxWidth * (originHeight / originWidth));
        } else {
          targetHeight = maxHeight;
          targetWidth = Math.round(maxHeight * (originWidth / originHeight));
        }
      }
      // canvas对图片进行缩放
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      // 清除画布
      context.clearRect(0, 0, targetWidth, targetHeight);
      // 图片压缩
      context.drawImage(Img, 0, 0, targetWidth, targetHeight);
      /*第一个参数是创建的img对象；第二三个参数是左上角坐标，后面两个是画布区域宽高*/

      //压缩后的图片转base64 url
      /*canvas.toDataURL(mimeType, qualityArgument),mimeType 默认值是'image/png';
       * qualityArgument表示导出的图片质量，只有导出为jpeg和webp格式的时候此参数才有效，默认值是0.92*/
      const newUrl = canvas.toDataURL("image/jpeg", 0.92).split(",")[1]; //base64 格式,取 ，后面的东西

      // const img = this.result.split(',')[1];
      const name = file.name;
      const size = file.size;
      const imageFile = {
        base64code: newUrl,
        name: name,
        size: size
      };

      if (mine.props.onSelect) {
        mine.props.onSelect(imageFile);
      }
    };
    reader.onerror = function(e) {
      Toast.info("文件读取出错");
      if (mine.props.onError) {
        mine.props.onError();
      }
    };

    e.target.value = "";
  };

  render() {
    return (
      <input
        style={this.props.style}
        className={`inputFile`}
        type="file"
        accept="image/*"
        multiple={this.props.multiple ? "multiple" : ""}
        id={this.ids}
        disabled={!this.props.able}
        onChange={this.readFile.bind(this)}
      />
    );
  }
}

/**
 * @description 上传多张图片组件
 * @author TangWJ
 * @date 2018-08-08
 * @class UploadImage
 * @extends {Component}
 * @param {number}maxSize(选填) 一次最多上传组件的数量; 当type为onePic时，当前字段无效
 * @param {func}currentDataCallback(选填) 上传成功时的回调 
 *          @example getImageData = (state, data) => {
                        //state 是否用户选中的所有图片全部上传； 已经全部上传成功返回true，否则返回false
                        //data 当前所有用户已上传的图片图片的数据 格式为：[{id: '114',url: 'http://new/img.jpg'}]
                     }
 * @param {array}originImgData(选填) 用户已有的相关数据 @example [{id: '114',url: 'http://new/img.jpg'}]
 * @param {string,number}symbol(选填) 引用该组件时的标志字段，类似于key
 * @param {bool}immediately(选填) 是否需要获得图片数据后立即上传，默认true
 * @param {object}imgStyle(选填)用户自定义样式，具有最高的优先级
**/
// @inject('userStore')
class UploadImage extends React.Component {
  static defaultProps = {
    type: "normal", //默认组件展示的UI界面
    immediately: true,
    imgStyle: {}
  };

  imgIndex = 0;

  constructor(props) {
    super(props);
    let imgData = [];
    !!this.props.originImgData && this.props.originImgData.length > 0
      ? (imgData = this.props.originImgData)
      : null;
    this.futureSize = 0; //用户点击上传的图片数量
    this.currentSize = 0; //实际已经上传到服务器的数量
    this.symbol = this.props.symbol;

    // 如果用户有默认的图片数据，为其添加上imgIndex属性
    if (imgData.length > 0) {
      for (let a = 0; a < imgData.length; a++) {
        this.imgIndex++;
        imgData[a].imgIndex = this.imgIndex;
      }
    }

    // 处理用户最大上传数量
    if (this.props.type === "onePic") {
      this.maxSize = 1;
    } else {
      this.props.maxSize && this.props.maxSize > 0
        ? (this.maxSize = this.props.maxSize)
        : (this.maxSize = 5);
    }

    // 处理初始化是否显示上传按钮
    let hideBtn = false;
    if (imgData.length >= this.maxSize) {
      hideBtn = true;
    }
    this.state = {
      imgDate: imgData,
      able: true,
      hideUploadBtn: hideBtn
    };
  }

  render() {
    let inputFileStyle = {};
    if (this.props.type === "onePic") {
      inputFileStyle = { top: 0, left: 0 };
    }
    const onPicHtml = <div className={`clickBtn`}>点此上传</div>;
    return (
      <div className={`${this.props.type} UploadImage`}>
        <div className={`uploadImgContainer`}>
          <div
            className={`photo ${this.hideUploadBtn()}`}
            style={this.props.imgStyle}
          >
            <img
              className={`icon-camera iconfont iconCamera`}
              src="./img/camera.png"
            />
            {this.props.type === "onePic" ? onPicHtml : ""}
            <ImageSelecter
              onSelect={this.uploadImageFunc}
              able={this.state.able}
              style={inputFileStyle}
            />
          </div>
          {this.renderUserImg()}
        </div>
      </div>
    );
  }

  /**
   * @description 删除用户已经上传的图片
   * @param {obj}event 获取用户点击删除事件
   */
  deleteUserUploadImg = event => {
    const imgIndex = event.target.parentElement.getAttribute("data-imgindex");
    let imgData = this.state.imgDate;
    let index = null;
    imgData.forEach((item, i) => {
      if (String(item.imgIndex) === String(imgIndex)) {
        index = i;
      }
    });
    if (imgData[index].id !== "waiting") {
      this.currentSize--;
    }
    this.futureSize--;
    imgData.splice(index, 1);
    this.setState({
      imgDate: imgData
    });
    if (this.futureSize < this.maxSize) {
      this.setState({
        able: true
      });
    } else {
      this.setState({
        able: false
      });
    }
    if (this.currentSize < this.maxSize) {
      this.setState({
        hideUploadBtn: false
      });
    } else {
      this.setState({
        hideUploadBtn: true
      });
    }
    if (this.props.currentDataCallback) {
      let currentState = null;
      this.currentSize === this.futureSize
        ? (currentState = true)
        : (currentState = false);
      this.props.currentDataCallback(
        currentState,
        this.state.imgDate,
        this.symbol
      );
    }
  };

  /**
   * @description 显示用户已经上传的图片
   * @returns 组装好的用户已上传图片的页面dom
   *
   * @author TangWJ
   * @date 2018-07-09
   */
  renderUserImg() {
    let _html = [];
    const imgDate = this.state.imgDate;
    imgDate.forEach((value, index) => {
      const nowItem = (
        <div className={`photo`} style={this.props.imgStyle} key={index}>
          <div className={`img`}>
            {
              /* {this.props.immediately ? (
              value.id === "waiting" ? (
                <div className={waiting}>{value.text}</div>
              ) : (
                <img src={value.url} alt="user upload img" />
              )
            ) : (
              <img
                src={`data:image/${value.type};base64,${value.base64code}`}
                alt="user unload img"
              />
            )} */
              <img
                src={`data:image/${value.type};base64,${value.base64code}`}
                alt="user unload img"
              />
            }
          </div>
          <div
            onClick={this.deleteUserUploadImg}
            data-id={value.id}
            data-imgindex={value.imgIndex}
          >
            <img src="./img/close.png" className={`close`} />
          </div>
        </div>
      );
      _html.push(nowItem);
    });
    return _html;
  }

  /**
   * @description 是否隐藏页面上传按钮
   * @author TangWJ
   * @date 2018-08-29
   * @returns css类
   */
  hideUploadBtn() {
    if (this.state.hideUploadBtn === true) {
      return "hide";
    } else {
      return "";
    }
  }

  /**
   * @description 上传图片至服务器
   * @param {obj}obj 获取用户选中的图片数据
   *
   * @author TangWJ
   * @date 2018-08-07
   */
  uploadImageFunc = obj => {
    this.futureSize++;
    this.imgIndex++;
    if (this.props.immediately) {
    } else {
      //只获取数据，不负责上传
      let imgData = this.state.imgDate;
      let type = obj.name.split(".");
      imgData.push({
        base64code: obj.base64code,
        type: type[type.length - 1],
        imgIndex: this.imgIndex
      });
      this.setState({
        imgDate: imgData
      });
      this.currentSize++;
      if (this.props.currentDataCallback) {
        //触发回调函数
        let currentState = null;
        this.currentSize === this.futureSize
          ? (currentState = true)
          : (currentState = false);
        this.props.currentDataCallback(
          currentState,
          this.state.imgDate,
          this.symbol
        );
      }
    }
    if (this.futureSize < this.maxSize) {
      this.setState({
        able: true
      });
    } else {
      this.setState({
        able: false
      });
    }
    let imgData = this.state.imgDate;
    if (imgData.length < this.maxSize) {
      this.setState({
        hideUploadBtn: false
      });
    } else {
      this.setState({
        hideUploadBtn: true
      });
    }
    // console.log(obj);
  };
}

// UploadImage.propTypes = {
//   maxSize: PropTypes.number,
//   originImgData: PropTypes.array, //已有的数据
//   biz: PropTypes.oneOf([0, 1, 2, 3, 4, 5]), //用途   0：头像，1：退换货，2：商品评价，3：上传发票，4:旧车行驶证 5:整车团团购上传图片，默认为0
//   currentDataCallback: PropTypes.func, // 上传成功时的回调
//   type: PropTypes.oneOf(["normal", "onePic"]),
//   immediately: PropTypes.bool,
//   imgStyle: PropTypes.object
// };

// Find all DOM containers, and render Like buttons into them.
document.querySelectorAll("#root").forEach(domContainer => {
  // Read the comment ID from a data-* attribute.
  const commentID = parseInt(domContainer.dataset.commentid, 10);
  ReactDOM.render(<DOM commentID={commentID} />, domContainer);
});
