<template>
    <div>
        <div class="content">
        <el-dialog :visible.sync="dialogImg">
            <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
        <template v-if="!nosee">
            <!-- 小程序名称 begin -->
            <el-form :model="weappInfoForm" ref="weappInfoForm" label-width="100px" class="form">
            <el-form-item label="小程序名称" prop="name">
                <el-input v-if="showName" v-model.trim="weappInfoForm.name" class="input"></el-input>
                <el-input v-else :value="weappInfoForm.name" readonly class="input"></el-input>
                <div class="dib btn-group">
                <el-button class="btn" v-if="showName" type="primary" @click="updateName">确定</el-button>
                <el-button class="btn" v-else-if="modify_used_count1 != 0" type="text" @click="showName = true">修改
                </el-button>
                </div>
                <div class="desc">
                请勿使用“商城”、“店铺”等行业通用名称，小程序发布前，可修改{{modify_used_count}}次名称。当前还能修改{{ modify_used_count1}}次。
                </div>
            </el-form-item>
            <el-form-item label="小程序头像" prop="headImage">
                <div class="df-r jc-fs ai-fe">
                <el-upload v-if="showHead" ref="uploadImg" :auto-upload="false" :show-file-list="false"
                    :on-remove="onRemove" class="upload-demo" action="1111" :before-upload="beforeAvatarUpload"
                    :on-change="onUploadChange" list-type="picture-card">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                    <i v-else class="el-icon-plus"></i>
                </el-upload>
                <el-upload action="1111" class="upload-demo" v-else disabled>
                    <img :src="weappInfoForm.headImage" class="avatar">
                </el-upload>
                <div class="dib btn-group">
                    <el-button class="btn" v-if="showHead" type="primary" @click='updateImage'>确定</el-button>
                    <el-button class="btn" v-else-if="modify_quota1 != 0" @click="showHead = true" type="text">修改
                    </el-button>
                </div>
                </div>
                <div class="desc">一年内可申请修改{{modify_quota}}次，今年还可修改{{modify_quota1}}次。</div>
            </el-form-item>
            <el-form-item label="小程序介绍" prop="desc">
                <el-input type="textarea" v-if="showdesc" rows="4" v-model.trim="weappInfoForm.desc" maxlength="120"
                show-word-limit class="input"></el-input>
                <el-input type="textarea" v-else rows="4" readonly :value="weappInfoForm.desc" class="input"></el-input>
                <div class="dib btn-group">
                <el-button class="btn" v-if="showdesc" type="primary" @click="updateDesc">确定</el-button>
                <el-button class="btn" v-else type="text" @click="showdesc = true">修改</el-button>
                </div>
                <div class="desc">最多120字，请确认介绍内容不含国家相关法律法规禁止内容。</div>
            </el-form-item>
            </el-form>
            <!-- 小程序名称 end -->

            <!-- 服务类目 begin -->
            <div class="services">
            <div class="services-header">
                <div class="df jc-sb">
                <div>
                    <span class="services-header-title">服务类目</span>
                    <span
                    class="services-header-desc">已添加{{tableData.length}}个，常规最多{{category_limit}}个，本月可添加{{quota}}次</span>
                </div>
                <el-button @click.stop="dialogService = true" type="primary">添加服务类目</el-button>
                </div>
            </div>
            <el-table :data="tableData" style="width: 100%">
                <el-table-column label="服务名称">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{scope.row.first_name +  " > "+ scope.row.second_name }}</span>
                </template>
                </el-table-column>
                <el-table-column label="所有状态">
                <template slot-scope="scope">
                    <span>{{ scope.row.audit_status == 1 ? '审核中' : scope.row.audit_status == 2 ? '审核不通过' : '审核通过' }}</span>
                </template>
                </el-table-column>
                <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
                </el-table-column>
            </el-table>

            <!-- 服务类目弹出层 begin -->
            <el-dialog class="service-dialog" title="添加服务类目" :visible.sync="dialogService" width="47%"
                :before-close="handleClose">
                <p class="desc tac">请根据小程序自身的功能，正确选择服务类目</p>
                <el-form :model="selectServiceForm" ref="selectServiceForm" label-width="100px" class="upload-service-wrap">
                <el-form-item v-for="(item, index) in selectServiceForm.serviceTypeData" label="服务类目" required
                    :key="index" class="select-service">
                    <el-row class="df ai-c">
                    <!-- 主类目 begin -->
                    <el-col :span="10">
                        <el-form-item :prop="`serviceTypeData[${index}].primary`" :rules="{
                        required: true, message: '主类目不能为空', trigger: ['blur', 'change']
                        }">
                        <el-select @change="choosePrimary($event,index)" v-model="item.primary" placeholder="请选择">
                            <el-option v-for="item in firstArr" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- 主类目 end -->

                    <!-- 子类目 begin -->
                    <el-col :span="10">
                        <el-form-item :prop="`serviceTypeData[${index}].secondary`" :rules="{
                        required: true, message: '子类目不能为空', trigger: ['blur', 'change']
                        }">
                        <el-select v-model="item.secondary" placeholder="请选择">
                            <el-option v-for="item in comSeconde" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- 子类目 end -->

                    <!-- 操作按钮 begin -->
                    <el-col :span="4" class="df jc-sb">
                        <template>
                        <i v-if="!(index >= 4)" @click.stop="addSelectServiceItem()"
                            class="el-icon-circle-plus-outline edit-service-btn"></i>
                        </template>
                        <template v-if="index !== 0">
                        <i @click.stop="removeSelectServiceItem(index)"
                            class="el-icon-remove-outline edit-service-btn"></i>
                        </template>
                    </el-col>
                    <!-- 操作按钮 end -->
                    </el-row>
                </el-form-item>
                <template>
                    <el-form-item label="资质文件" prop="dialogImage">
                    <div class="desc">
                        <p>上传源文件或复印件，复印件务必加盖公司公章</p>
                        <p>文件格式为jpg、jpeg、bmp、gif或png，文件大小不超过5M。</p>
                    </div>
                    <el-upload action="111" list-type="picture-card" :on-change="changeFile" :auto-upload="false"
                        accept=".jpg, jpeg, bmp, .gif, .png" :on-preview="handlePictureCardPreview">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    </el-form-item>
                </template>
                <div class="df-r dialog-footer">
                    <el-button @click="dialogService = false">取消</el-button>
                    <el-button :disabled="disBtn" @click="submitUpdateServiceType('selectServiceForm')" type="primary">提交
                    </el-button>
                </div>
                </el-form>
            </el-dialog>
            <!-- 服务类目弹出层 end -->
            </div>
            <!-- 服务类目 end -->
        </template>
        <template v-else>
            <p style="padding:50px;text-align:center">通过授权的小程序,请前往<a target="_blank" style="color:#3385ff"
                href="https://mp.weixin.qq.com/cgi-bin/loginpage">微信公众平台</a>登录小程序进行管理信息</p>
        </template>
        <!-- <div class="df-r btn-group btn-end">
            <el-button type="primary">提交</el-button>
        </div> -->
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { SmallMudles } from '@/store/modules/smallApp'
import { mixins } from 'vue-class-component'
@Component({
    name: 'BaseMessage',
})
export default class extends mixins(){
    private showdesc = false
    private showName = false
    private showHead = false
    private disBtn = false
    private nosee = false
    private weappInfoForm = {
        name: "", // 小程序名称
        desc: "",
        headImage: ""
    }
    /** 服务类目 begin */
    // 服务类目表格
    private tableData = []
    // 服务类目弹出
    private dialogService = false
    private dialogImg = false
    //   服务类目选择
    private selectServiceForm = {
        serviceTypeData: [{
        primary: "",
        secondary: "",
        }],
        dialogImage: [] //认证文件
    }
    private dialogImageUrl = ""
    /** 服务类目 end */
    private imageUrl = '' //小程序头像
    private imageFile = null //小程序头像文件
    private originArr = []
    private firstArr = [] //主类目
    private secondArr = [] //副类目
    private comSeconde = []
    private modify_quota = ''
    private modify_quota1 = ''
    private modify_used_count = ''
    private modify_used_count1 = ''
    private category_limit = '' //最多可以设置的类目数量
    private limit = '' //一个更改周期内可以添加类目的次数
    private quota = '' //本更改周期内还可以添加类目的次数
    private appletId = ''
    private choosePrimary(el, index) {
        let that = this;
        that.selectServiceForm.serviceTypeData[index].secondary = '';
        if (that.selectServiceForm.serviceTypeData[index].primary) {
          that.comSeconde = that.firstArr[that.firstArr.findIndex(i => {
            return i.id == that.selectServiceForm.serviceTypeData[index].primary
          })].childerArr
        }
      }
      //获取token
      private async myToken() {
        let that = this;
        const propsData = {
          data: {
            corpid: this.$store.state.appid
          }
        };
        try {
          let res = await getToken(propsData);
          this.saveAppToken(res.access_token);
          this.getWeappInfo();
          this.getAllCategories();
          this.getCategory();

        } catch (error) {
          // console.log(error)
        }
      }
      //认证文件上传
      private changeFile(file, fileList) {
        var that = this;
        that.selectServiceForm.dialogImage = fileList
      }
      //限制上传
      private beforeAvatarUpload(file) {

      }
      //上传小程序图片
      private onUploadChange(file, fileList) {
        var that = this;
        that.imageUrl = file.url;
        that.imageFile = file.raw;
      }
      //删除图片
      private onRemove(file, fileList) {
        this.imageUrl = '';
        this.imageFile = null
      }
      private getMediaid(file) {
        let that = this;
        return new Promise((resolve, reject) => {
          let data = new FormData();
          data.append('file', file);
          data.append('flag', 1);
          data.append('type', 'image');
          data.append('access_token', that.appToken);
          Axios({
            url: that.wangtaoUrl + '/wx/addMedia',
            method: 'post',
            data: data
          }).then(res => {
            resolve(res.data)
          }).catch(error => {
            reject(error)
          })
        })

      }
      //修改小程序图片
      private async updateImage() {
        if (!this.imageUrl) {
          return this.$message.error('头像不能为空')
        }
        let res = await this.getMediaid(this.imageFile);
        let media_id = res.data.media_id;
        let path = res.data.path;
        if (!media_id) {
          return this.$message.error('新增素材失败')
        }
        const propsData = {
          access_token: this.appToken,
          data: {
            access_token: this.appToken,
            head_img_media_id: media_id,
            head_img_url: path,
            appletId: this.$store.state.appletId,
            "x1": 0,
            "y1": 0,
            "x2": 0.8,
            "y2": 0.8
          }
        };
        try {
          const res = await modifyHeadImage(propsData);
          this.showHead = false;
          this.imageUrl = '';
          this.imageFile = null;
          this.$refs.uploadImg.clearFiles();
          this.getWeappInfo()
        } catch (error) {
          return this.$message.error(error.resultInfo)
        }
      }
      //修改名称
      private async updateName() {
        if (!this.weappInfoForm.name) {
          return this.$message.error('名称不能为空')
        }
        const propsData = {
          access_token: this.appToken,
          data: {
            access_token: this.appToken,
            nick_name: this.weappInfoForm.name,
            appletId: this.$store.state.appletId,
            "id_card": "",
            "license": "",
          }
        };
        try {
          const res = await setNickname(propsData);
          this.showName = false;
          this.getWeappInfo()
        } catch (error) {
          return this.$message.error(error.resultInfo)
        }
      }
      //修改介绍
      private async updateDesc() {
        if (!this.weappInfoForm.desc) {
          return this.$message.error('小程序简介不能为空')
        }
        const propsData = {
          access_token: this.appToken,
          data: {
            access_token: this.appToken,
            appletId: this.$store.state.appletId,
            signature: this.weappInfoForm.desc
          }
        };
        try {
          const res = await modifySignature(propsData);
          this.showdesc = false
          this.getWeappInfo()
        } catch (error) {
          return this.$message.error(error.resultInfo)
        }
      }
      private async getFileMediaid() {
        let certicates = [];
        let result = await new Promise((resolve, reject) => {
          this.selectServiceForm.dialogImage.reduce((init, item) => {
            let _self = item;
            return init.then(() => {
              return new Promise((resolve, reject) => {
                this.getMediaid(item.raw).then(res => {
                  let id = res.data.media_id;
                  let path = res.data.path;
                  let obj = {
                    key: _self.name,
                    vaule: id,
                    path: path
                  };
                  certicates.push(obj)
                  resolve()
                })
              })
            })
          }, Promise.resolve()).then(() => {
            resolve(certicates)
          })
        })
        return result
      }
      //新增条目
      private async updateServiceType() {
        let that = this;
        this.disBtn = true;
        let categories = [];
        let certicates = await this.getFileMediaid();
        this.selectServiceForm.serviceTypeData.forEach(item => {
          let obj = {};
          obj.first = item.primary;
          obj.second = item.secondary;
          obj.certicates = certicates;
          categories.push(obj);
        })
        const propsData = {
          access_token: this.appToken,
          data: {
            access_token: this.appToken,
            categories: categories
          }
        };
        try {
          const res = await addCategory(propsData);
          this.dialogService = false;
          this.getCategory();
        } catch (error) {
          return this.$message.error(error.resultInfo)
        }
        this.disBtn = false;
      }
      //获取小程序信息
      private async getWeappInfo() {
        let that = this;
        const propsData = {
          access_token: this.appToken,
          data: {
            applet_id: this.$store.state.appletId,
            access_token: this.appToken
          }
        };
        try {
          const res = await reqGetWeappInfo(propsData);
          if (res.createState != 0) {
            that.nosee = true;
          }
          this.savaAppletType(res.appletType);
          this.saveShopId(res.shopId);
          this.savePrincipalName(res.principalName)
          this.saveCode(res.code)
          this.weappInfoForm.name = res.appletName;
          this.weappInfoForm.desc = res.introduce;
          this.weappInfoForm.headImage = res.appletImage;
          this.modify_quota = res.imageUpdateQuota; //头像修改次数
          this.modify_quota1 = res.imageUpdateResidue; //头像剩余修改次数
          this.modify_used_count = res.nameUpdateQuota; //名称修改次数
          this.modify_used_count1 = res.nameUpdateResidue; //名称剩余修改次数
          if (!this.weappInfoForm.name) {
            this.showName = true;
          }
          if (!this.weappInfoForm.desc) {
            this.showdesc = true;
          }
          if (!this.weappInfoForm.headImage) {
            this.showHead = true;
          }
        } catch (error) {
          return this.$message.error(error.resultInfo)
        }
      }
      // serviceTypelight
      /*
      tableRowClassName({ row, rowIndex }) {
        if (row.status === "1102") {
          return "warning-row";
        } else if (row.status === "1103") {
          return "success-row";
        } else if (row.status === "1104") {
          return "danger-row";
        }
        return "";
      },
       */
      /** 服务类目相关 begin */
      //获取所有类目
      private async getAllCategories() {
        let that = this;
        const propsData = {
          access_token: this.appToken,
        };
        try {
          const res = await getAllCategories(propsData);
          this.originArr = JSON.parse(JSON.stringify(res.categories_list.categories));

          this.originArr.forEach(item => {
            if (item.level && item.level == 1) {
              this.firstArr.push(Object.assign({}, item, {
                childerArr: []
              }))
            }
            if (item.level && item.level == 2) {
              this.secondArr.push(item)
            }
          })
          this.firstArr.forEach(item => {
            item.childerArr = this.secondArr.filter(j => {
              return j.father == item.id;
            })
          })
        } catch (error) {
          return this.$message.error(error.resultInfo)
        }
      }
      //获取已经写好的类目
      private async getCategory() {
        let that = this;
        const propsData = {
          access_token: this.appToken,
          data: {
            access_token: this.appToken,
            applet_id: that.$store.state.appletId
          }
        };
        try {
          const res = await getCategory(propsData);
          this.category_limit = res.category_limit;
          this.limit = res.limit;
          this.quota = res.quota;
          this.tableData = res.categories;
        } catch (error) {
          return this.$message.error(error.resultInfo)
        }
      }

      private submitUpdateServiceType(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.updateServiceType();
          } else {
            return false;
          }
        });
      }
      //新增类目
      private addSelectServiceItem() {
        const serviceTypeData = this.selectServiceForm.serviceTypeData;
        if (serviceTypeData.length >= 5) return;
        serviceTypeData.push({
          primary: "",
          secondary: ""
        });
      }
      private removeSelectServiceItem(index) {
        this.selectServiceForm.serviceTypeData.splice(index);
      }
      //确认删除条目
      private handleDelete(index, row) {
        let that = this;
        that.$confirm('是否删除该类目', '提示', {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.delList(row)
        }).catch(() => {

        })
      }
      //删除条目
      private async delList(row) {
        let propsData = {
          access_token: this.appToken,
          data: {
            access_token: this.appToken,
            // categoryId: row.categoryId,
            first: row.first,
            second: row.second
          }
        }

        try {
          const res = await webappDelList(propsData);
          this.getCategory()
        } catch (error) {
          return this.$message.error(error.resultInfo)
        }
      }
      private handleClose(done) {
        this.$confirm("确认关闭？")
          .then(_ => {
            done();
          })
          .catch(_ => {});
      }
      /** 服务类目相关 end */
      /** 文件上传相关 begin */
      private handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogImg = true;
      }
      /** 文件上传相关 end */
}

</script>

<style lang="scss" scoped>
    .content {
        margin: 40px 80px;

        .form {
        margin-top: 40px;

        .input {
            width: 300px;
        }

        .btn {
            margin-left: 26px;
        }

        .desc {
            font-size: 14px;
        }
        }

        .services {
        margin-top: 40px;
        }
    }

    .el-table {
        .success-row {
        background-color: #67C23A;
        }

        .warning-row {
        background-color: #E6A23C;
        }

        .danger-row {
        background-color: #F56C6C;
        }
    }

    .service-dialog {
        .upload-service-wrap {
        padding: 0 80px;
        margin-top: 30px;

        .select-service {
            width: 100%;

            .edit-service-btn {
            font-size: 24px;
            cursor: pointer;
            }
        }
        }

        .dialog-footer {
        margin-top: 40px;
        }
    }

    .upload-demo {
        display: flex;

        img {
        width: 148px;
        height: 148px;
        }
    }

    .el-list-enter-active,
    .el-list-leave-active {
        transition: none;
    }

    .el-list-enter,
    .el-list-leave-active {
        opacity: 0;
    }

    .el-upload-list {
        height: 40px;
    }

    .btn-end {
        margin-top: 30px;

        button {
        width: 150px
        }
    }

    // .btn-group {
    //   margin-top: 30px;
    // }
</style>
