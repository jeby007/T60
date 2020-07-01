/**
* 用户相关接口
*/
import serve from '@/common/serverApi.js';
import interActiveHandler from '@/common/InterActiveHandler';//引入用户交互代理
import ModeDrive from '@/packages/mode-drive'; //判断终端
export default{
    

    //获取pc 端Token flag true,需要验证是否登录,false 不需要验证是否登录
    getPcToken:function(){

        //return localStorage.getItem('token');
        return sessionStorage.getItem('token');
    },
    //设置pc端token
    setPcToken:function(token){
       // localStorage.setItem('token',token);
       sessionStorage.setItem('token',token);
    },

    //端验证用户是否登录
    verificationPcLogin:function(token){
 
        return serve.get("Home/Login/verificationPcLogin",{token: token}).then(rs => {

            if(rs.error_code != 0){
                throw new Error('验证失败');
            }
            return rs;
        });
    },
    //获取登陆跳转链接
    getLoginUrl:function(params={}){
      
      return serve.get("Home/Login/login",params).then(rs => {
            if(rs.error_code != 0){
                throw new Error(rs.error_code,rs.error);
            }
            return rs.data;
        });
    },
    //获取token
    getPcUserToken:function(params){
      
      return serve.get("Home/Login/getPcUserToken",params).then(rs => {
            if(rs.error_code != 0){
                throw new Error('没登录');
            }
            return rs;
        });
    },
    //app登录 验证
    getInfoByToken:function(token){
        return serve.get("Home/Index/getUuidByToken",{token: token}).then(rs => {
            if(rs.error_code != 0){
                throw new Error(rs);
            }
            return rs;
        });
	}
	
};