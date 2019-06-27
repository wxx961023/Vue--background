const express = require('express')
const router = express.Router()
const passport = require('passport')

const Profile = require('../../models/Profile')
// $route GET api/profiles/test
// @desc 返回的请求的json数据
// @access public
router.get("/test",(req,res)=>{
    res.json({msg:"profile works"})
})

// $route POST api/profiles/add
// @desc 创建信息接口
// @access Private
router.post(
    "/add",
    passport.authenticate("jwt",{session:false}),
    (req,res)=>{
        const profileFiles = {}

        if(req.body.type) profileFiles.type =  req.body.type
        if(req.body.describe) profileFiles.describe =  req.body.describe
        if(req.body.income) profileFiles.income =  req.body.income
        if(req.body.expend) profileFiles.expend =  req.body.expend
        if(req.body.cash) profileFiles.cash =  req.body.cash
        if(req.body.remark) profileFiles.remark =  req.body.remark

        new Profile(profileFiles).save().then(profile=>{
            res.json(profile)
        })
    }
)

// $route GET api/profiles
// @desc 获取所有信息
// @access Private
router.get(
    "/",
    passport.authenticate("jwt",{session:false}),
    (req,res)=>{
        Profile.find()
            .then(profile=>{
                if(!profile){
                    return res.status(404).json("没有任何内容")
                }
                res.json(profile)
            })
            .catch(err => res.status(404).json(err))
    }
)

// $route GET api/profiles/:id
// @desc 获取单个信息
// @access Private
router.get(
    "/:id",
    passport.authenticate("jwt",{session:false}),
    (req,res)=>{
        Profile.findOne({_id:req.params.id})
            .then(profile=>{
                if(!profile){
                    return res.status(404).json("没有任何内容")
                }
                res.json(profile)
            })
            .catch(err => res.status(404).json(err))
    }
)

// $route POST api/profiles/edit/:id
// @desc 编辑信息
// @access Private
router.post(
    "/edit/:id",
    passport.authenticate("jwt",{session:false}),
    (req,res)=>{
        const profileFiles = {}

        if(req.body.type) profileFiles.type =  req.body.type
        if(req.body.describe) profileFiles.describe =  req.body.describe
        if(req.body.income) profileFiles.income =  req.body.income
        if(req.body.expend) profileFiles.expend =  req.body.expend
        if(req.body.cash) profileFiles.cash =  req.body.cash
        if(req.body.remark) profileFiles.remark =  req.body.remark

        Profile.findOneAndUpdate(
            {_id:req.params.id},
            {$set:profileFiles},
            {new:true}
        ).then(profile=>res.json(profile))
            
    }
)

// $route GET api/profiles/delete/:id
// @desc 删除信息接口
// @access Private
router.delete(
    "/delete/:id",
    passport.authenticate("jwt",{session:false}),
    (req,res)=>{
        Profile.findOneAndRemove({_id:req.params.id})
            .then(profile=>{
                profile.save()
                    .then(profile=>res.json(profile))
            })
            .catch(err=>res.status(404).json("删除失败"))
    }
)

module.exports = router
