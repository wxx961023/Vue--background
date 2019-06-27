<template>
    <div class="fillContainer">
        <div>
            <el-form :inline="true" ref="add_data" :model="search_data">
                <!-- 筛选 -->
                <div class="date">
                    <el-form-item label="按照时间筛选">
                    <el-date-picker
                        v-model="search_data.startTime"
                        type="datetime"
                        placeholder="选择开始时间"
                    >
                    </el-date-picker>
                    --
                    <el-date-picker
                        v-model="search_data.endTime"
                        type="datetime"
                        placeholder="选择结束时间"
                    >
                    </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" icon="search" type="primary" @click="handleSearch">筛选</el-button>
                    </el-form-item>
                    <el-form-item class="btnRight">
                        <el-button 
                            size="small" 
                            icon="view" 
                            type="primary" 
                            @click="handleAdd"
                            v-if="user.identity==='manager'" 
                        >添加</el-button>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <div class="table_container">
            <el-table
                v-if="tableData.length > 0"
                :data="tableData"
                max-height="450"
                border
                style="width: 100%"
                :default-sort="{prop: 'date', order: 'descending'}" >
                <el-table-column type="index" label="序号" width="70" align="center"></el-table-column>
                <el-table-column prop="data" label="创建时间" width="250" align="center">
                    <template slot-scope="scope">
                        <i class="el-icon-time"></i>
                        <span style="margin-left:10px">{{scope.row.data}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="type" label="收支类型" align="center" width="150"></el-table-column>
                <el-table-column prop="describe" label="收支描述" align="center" width="180"></el-table-column>
                <el-table-column prop="income" label="收入" align="center" width="170">
                    <template slot-scope="scope">
                        <span style="color:#00d053">+ {{ scope.row.income }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="expend" label="支出" align="center" width="170">
                    <template slot-scope="scope">
                        <span style="color:#f56767">- {{ scope.row.expend }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="cash" label="账户现金" align="center" width="170">
                    <template slot-scope="scope">
                        <span style="color:#4db3ff">{{ scope.row.cash }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注" align="center" width="220"></el-table-column>
                <el-table-column 
                    label="操作" 
                    prop="operation" 
                    align="center" 
                    width="240"  
                    v-if="user.identity==='manager'"
                >
                    <template slot-scope="scope">
                        <el-button
                            size="small"
                            type="warning"
                            icon="edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            size="small"
                            type="danger"
                            icon="delete"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-row>
                <el-col :span="24">
                    <div class="pagination">
                        <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page.sync="paginations.page_index"
                            :page-sizes="paginations.page_sizes"
                            :page-size="paginations.page_size"
                            :layout="paginations.layout"
                            :total="paginations.total">
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>
        </div>
        <Dialog :dialog="dialog" @update="getTableData" :formData="formData"></Dialog>
    </div>
</template>

<script>
import Dialog from "../components/Dialog";
export default {
    name: "foundlist",
    components: {
        Dialog
    },
    data() {
        return {
            search_data:{
                startTime:'',
                endTime:''
            },
            filterTableData:[],
            paginations:{
                page_index:1,
                total:0,
                page_size:5,  // 1页显示多少条
                page_sizes:[5,10,15,20], //每页显示多少条
                layout:"total,sizes,prev,pager,next,jumper"
            },
            tableData: [],
            allTableData:[],
            formData: {
                type: "",
                describe: "",
                income: "",
                expend: "",
                cash: "",
                remark: "",
                id: ""
            },
            dialog: {
                show: false,
                title: "",
                option: "edit"
            }
        };
    },
    computed: {
        user(){
            return this.$store.getters.user
        }
    },
    created() {
        this.getTableData();
    },
    methods: {
        getTableData() {
            this.$axios
                .get("/api/profiles")
                .then(res => {
                    this.allTableData = res.data;
                    this.filterTableData= res.data;
                    this.setPagination()
                })
                .catch(err => {
                    console.log(err);
                });
        },
        setPagination(){
            this.paginations.total =  this.allTableData.length
            this.paginations.page_index = 1
            this.paginations.page_size = 5
            
            this.tableData = this.allTableData.filter((item,index)=>{
                return index < this.paginations.page_size
            })
        },
        handleEdit(index, row) {
            this.dialog = {
                show: true,
                title: "修改资金信息",
                option: "edit"
            };
            this.formData = {
                type: row.type,
                describe: row.describe,
                income: row.income,
                expend: row.expend,
                cash: row.cash,
                remark: row.remark,
                id: row._id
            };
        },
        handleDelete(index, row) {
            this.$axios.delete(`/api/profiles/delete/${row._id}`) 
                .then(res=>{
                    this.$message({
                        message:'删除成功',
                    })
                    this.getTableData()
                })
        },
        handleAdd() {
            this.dialog = {
                show: true,
                title: "添加资金信息",
                option: "add"
            };
            this.formData = {
                type: '',
                describe: '',
                income: '',
                expend: '',
                cash: '',
                remark: '',
                id: '',
            };
            this.dialog.show = true;
        },
        handleSizeChange(page_size){
            this.paginations.page_index = 1,
            this.paginations.page_size = page_size
            
            this.tableData = this.allTableData.filter((item,index)=>{
                return index < page_size
            })
        },
        handleCurrentChange(page){
            console.log(1)
            let index = this.paginations.page_size*(page-1)
            let nums = this.paginations.page_size*page
            let tables = []

            for(let i =index;i<nums;i++){
                if(this.allTableData[i]){
                    tables.push(this.allTableData[i])
                }
                this.tableData = tables
            }
        },
        handleSearch(){
            console.log(2)
            if(!this.search_data.startTime || !this.search_data.endTime){
                this.$message({
                    type:'warning',
                    message:'请选择时间区间'
                })
                this.getTableData()
                return
            }
            const sTime = this.search_data.startTime.getTime()
            const eTime = this.search_data.endTime.getTime()
            this.allTableData = this.filterTableData.filter(item=>{
                let date = new Date(item.data)
                let time = date.getTime()
                return time>=sTime && time <=eTime
            })

            this.setPagination()

        }
    }
};
</script>

<style scoped>
.date{
    width: 1700px;
}
.fillContainer {
    width: 100%;
    height: 100%;
    padding: 16px;
    box-sizing: border-box;
}
.btnRight {
    float: right;
    padding-right: 100px;
}
.pagination {
    text-align: right;
    margin-top: 10px;
    margin-right: 280px;
}
</style>
