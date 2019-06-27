<template>
    <div class="register">
        <section class="form-container">
            <div class="manage-tip">
                <span class="title">米修在线后台管理系统</span>
                <el-form :model="registerUser" :rules="rules" ref="registerForm" label-width="80px" class="registerForm" >
                    <el-form-item label="用户名" prop="name">
                        <el-input v-model="registerUser.name" placeholder="请输入用户名"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="registerUser.email" placeholder="请输入email"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input type="password" v-model="registerUser.password" placeholder="请输入密码"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="password2">
                        <el-input type="password" v-model="registerUser.password2" placeholder="请确认密码"></el-input>
                    </el-form-item>
                    <el-form-item label="选择身份">
                        <el-select v-model="registerUser.identity" placeholder="请选择身份">
                            <el-option label="管理员" value="manager"></el-option>
                            <el-option label="员工" value="employee"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" class="submit-btn" @click="submitForm('registerForm')">注册</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </section>
    </div>
</template>

<script>
export default {
    name: "Register",
    data(){
        var validatePass2 = (rule, value, callback) => {
            if (value !== this.registerUser.password) {
            callback(new Error('两次输入密码不一致!'));
            } else {
            callback();
            }
        };
        return{
            registerUser:{
                name:"",
                email:"",
                password:"",
                password2:"",
                identity:""
            },
            rules:{
                name:[
                    {
                        required:true,
                        message:"用户名不能为空",
                        trigger:"blur",
                    },
                    {
                        min:2,
                        max:10,
                        message:"用户名长度为2-10个字符"
                    }
                ],
                email:[
                    {   type:"email",
                        required:true,
                        message:"邮箱格式不正确",
                        trigger:"blur",
                    },
                ],
                password:[
                    {
                        required:true,
                        message:"密码不能为空",
                        trigger:"blur"
                    },
                    {
                        min:6,
                        max:18,
                        message:"密码长度为6-18个字符"
                    }
                ],
                password2:[
                    {
                        required:true,
                        trigger:"blur",
                        message:"确认密码不能为空",
                    },
                    {
                        min:6,
                        max:18,
                        message:"密码长度为6-18个字符"
                    },
                    { 
                        validator: validatePass2, 
                        trigger: 'blur'
                    }
                ],
            }
        }
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$axios
                        .post("/api/users/register", this.registerUser)
                        .then(res=>{
                            //注册成功
                            this.$message({
                                message:"账号注册成功",
                                type:"success"
                            })
                        })
                    this.$router.push('/login')
                }
            });
        }
    },
};
</script>


<style scoped>
.register {
    position: relative;
    width: 100%;
    height: 100%;
    background: url(../assets/bg.jpg) no-repeat center center;
    background-size: 100% 100%;
}
.form-container {
    width: 370px;
    height: 210px;
    position: absolute;
    top: 10%;
    left: 34%;
    padding: 25px;
    border-radius: 5px;
    text-align: center;
}
.form-container .manage-tip .title {
    font-family: "Microsoft YaHei";
    font-weight: bold;
    font-size: 26px;
    color: #fff;
}
.registerForm {
    margin-top: 20px;
    background-color: #fff;
    padding: 20px 40px 20px 20px;
    border-radius: 5px;
    box-shadow: 0px 5px 10px #cccc;
}

.submit-btn {
    width: 100%;
}
</style>
