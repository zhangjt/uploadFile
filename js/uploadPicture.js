;var uploadFile={
	upload:function(elem){
		var self=this;
		this.elem=elem;
		this.file=this.elem.files[0];  //这里单图片上传
		this.name=this.file.name;
		this.size=this.file.size;
		this.type=this.file.type;
		event.preventDefault();
		    
		if (!this.file) {return;}

	    console.log(this.type+this.size);
		// if (size>10024) {
		//     console.log('图片太大了,重新上传小的吧');
		//     elem.parentNode.reset();
		// }
		var isTrue=/image\/\w+/.test(this.type); //\w匹配字母数字或下划线
		if (!isTrue) {
		    console.log('请上传图片文件');
		    this.elem.parentNode.reset(); 
		    return;
		};
		//使用FileReader对象读取文件file内容
		//FileReader对象的readAsDataURL方法获取本地图片url
		//reader读取的文件内容是base64,利用这个url就能实现上传前预览图片
		var reader= new FileReader();
		reader.onload=function(e){
		    
		    //e.target.result==this.result,都是本地图片的base64:URL;
		    var src=e.target.result;
		    self.createCanvas(self.elem,src,self.type);
		};
		reader.readAsDataURL(this.file);
	},
	createCanvas:function(elem,src,type){
		var _this=this;
		//创建一个canvas和一个新图片对象
		var canvas=document.createElement('canvas'),
		    cxt=canvas.getContext('2d'); 
		var img = new Image(),   //原始图片
		imgCanvas= new Image();  //压缩处理后的图片

		img.src=src;  //原始图片


		img.onload=function(){ 

			w=this.naturalWidth;
			h=this.naturalHeight;
			// document.body.appendChild(this);
			canvas.width=w;
			canvas.height=h;

			var maxHeight=1500;  //自定义值600;
			if (h>maxHeight) {
			    //等比例缩放
			    canvas.width*=maxHeight/h;
			    canvas.height=maxHeight;
			}
			
			canvas.setAttribute('style','border:1px solid pink;');
			//drawImage()设置:一般img的顶点位置为(0,0),宽高为原画的宽高,canvas的宽高为原图缩放倍数后的宽高,不然出现蜜汁现象;
			// setIntervel(function(){
			// 	cxt.drawImage(img,0,0,w,h,0,0,canvas.width,canvas.height);
			// },20);
			cxt.drawImage(img,0,0,w,h,0,0,canvas.width,canvas.height);


		    //读取canvas画布上图片的数据,赋值到新图片对象。其默认是png格式(输出的base64,较原图片size还要大).原图为jpeg输出也是jpeg的话,图片大小(较原图片)缩小一倍多,但是若原图片是png格式的有透明像素的部分的话,直接转成jpeg会黑化,所以最好是原格式转;第二参数(图片质量)一般为0.92,改变值不会影响图片大小.
		    imgCanvas.src=canvas.toDataURL(type,0.92);
		    //canvas.toDataURL 返回的默认格式是 image/png,这里输入原图片格式type
		    imgCanvas.setAttribute('class','preview');
	
		    var view=document.querySelector('.view');
		    view.appendChild(imgCanvas);
		    //到这一步,已经把图片压缩好,可以直接提交压缩后的图片base64编码形式到服务器.

		    //继续下一步,将转成ASCII数据→类型数组Uint8Array→blob对象的图片文件,后再提交到服务器
		    //提交form表单的准备:
		    var strB=imgCanvas.src.split(',')[1];
		    //Base64编码转成ASCII编码
		    var data=window.atob(strB);
		    //此时的data是一堆乱码
		    //使用类型数组Uint8Array,新建一个blod对象值
		    var ia = new Uint8Array(data.length);
		    for (var i = 0; i < data.length; i++) {
		          ia[i] = data.charCodeAt(i);
		    };
		    //Blob对象:一个字段的值;
		    var blob = new Blob([ia], {
		     type:type
		    });
		    var fd = new FormData();
		    fd.append("myFile", blob,_this.name);
		    //fd.get("myFile")获取forData的键值;第三个参数为自定义图片名称
		    //可以直接表单传
		    // var fd = new FormData();
		    // fd.append('file', $('from#file')[0].files[0]);
		    
		    //再尝试从formDAta里面的file获取出来,展示:效果也正常 
		    var file=fd.get('myFile');
		    console.log(file);
		    var reader2=new FileReader();
		    reader2.onload=function(e){
		        src2=e.target.result;
		        var img2=new Image();
		        img2.src=src2;
		        img2.width=100;
		        img2.height=100;
		        img2.setAttribute('style','background:pink');
		        // document.body.appendChild(img2);
		    };
		    reader2.readAsDataURL(file);
		};
		
	},
	clearImg:function(){
	
		var view=document.querySelector('.view');
		view.innerHTML='';
	}
};