;var uploadFile={
	upload:function(elem){
		var self=this;
		// var this.elem=elem;
		event.preventDefault();
		var file=elem.files[0];  //这里单图片上传
		    
		if (!file) {return;}
		var size=file.size,
		    type=file.type;
		    console.log(type+size);
		// if (size>10024) {
		//     console.log('图片太大了,重新上传小的吧');
		//     elem.parentNode.reset();
		// }

		var isTrue=/image\/\w+/.test(type);
		if (!isTrue) {
		    console.log('请上传图片文件');
		    elem.parentNode.reset(); 
		    return;
		};
		//使用FileReader对象读取文件file内容
		//FileReader对象的readAsDataURL方法获取本地图片url
		//reader读取的文件内容是base64,利用这个url就能实现上传前预览图片
		var reader= new FileReader();
		reader.readAsDataURL(file);
		reader.onload=function(e){
		    
		    //e.target.result==this.result,都是本地图片的base64:URL;
		    var src=e.target.result;
		    self.createCanvas(elem,src,type);
		};
	},
	createCanvas:function(elem,src,type){

		//创建一个canvas和一个新图片对象
		var canvas=document.createElement('canvas'),
		    cxt=canvas.getContext('2d'); 
		var img = new Image(),
		imgCanvas= new Image();

		img.src=src;//原始图片
		
		w=img.naturalWidth;
		h=img.naturalHeight;
		canvas.width=w;
		canvas.height=h;

		var maxHeight=600;  //自定义值600;
		if (h>maxHeight) {
		    //等比例缩放
		    canvas.width*=maxHeight/h;
		    canvas.height=maxHeight;
		}
		
		canvas.setAttribute('style','border:1px solid pink;');
		//drawImage()设置:一般img的顶点位置为0,宽高为原画的宽高,canvas的宽高为原图缩放倍数色宽高,不然出现蜜汁现象;
		cxt.drawImage(img,0,0,w,h,0,0,canvas.width,canvas.height);

		img.onload=function(){ 
		    //读取canvas画布上图片的数据,赋值到新图片对象。其默认是png格式(输出的base64,较原图片size还要大).原图为jpeg输出也是jpeg的话,图片大小(较原图片)缩小一倍多,但是若原图片是png格式的有透明像素的部分的话,直接转成jpeg会黑化,所以最好是原格式转;第二参数(图片质量)一般为0.92,改变值不会影响图片大小.
		    imgCanvas.src=canvas.toDataURL(type,0.92);
		    imgCanvas.setAttribute('class','preview');
		
		    elem.parentNode.appendChild(imgCanvas);
		    
		    //到这一步,已经把图片压缩好,可以直接提交压缩后的图片base64的src到服务器.不然继续下一步,转成ASCII数据图片文件
		    var strB=imgCanvas.src.split(',')[1];
		    
		    //Base64编码转成ASCII编码
		    var data=window.atob(strB);
		    //此时的data是一堆乱码
		    //使用类型数组Uint8Array,新建一个blod对象值
		    var ia = new Uint8Array(data.length);
		    for (var i = 0; i < data.length; i++) {
		          ia[i] = data.charCodeAt(i);
		    };

		     //canvas.toDataURL 返回的默认格式就是 image/png
		     //Blob对象:一个字段的值;
		    var blob = new Blob([ia], {
		     type:type
		    });
		    var fd = new FormData();
		    fd.append("myFile", blob,"fileName");
		    //fd.get("myFile")获取forData的键值;fileName为自定义图片名称
		    //可以直接表单传
		    // var formData = new FormData();
		    // formData.append('file', $('from#file')[0].files[0]);
		    
		    //再尝试从formDAta里面的file获取出来,展示:效果也正常 
		    var file=fd.get('myFile');
		    console.log(file);
		    var reader2=new FileReader();
		    
		    reader2.readAsDataURL(file);
		    reader2.onload=function(e){
		        src2=e.target.result;
		        var img2=new Image();
		        img2.src=src2;
		        img2.width=100;
		        img2.height=100;
		        img2.setAttribute('style','background:pink');
		        // document.body.appendChild(img2);
		    };
		    

		};
	},
	clearImg:function(){
	
		var imgs=document.getElementsByTagName('img');
		if (imgs) {
			for (var i = 0; i < imgs.length; i++) {
				var img=imgs[i];
				var imgClass=img.getAttribute('class');
				if (imgClass=="preview") {
					console.log(imgClass);
					img.parentNode.removeChild(img);
				}	
			}
		}
	}
};