<template>
  <div
    id="freight"
    class="app-container"
  >
    <div class="public-box">
      <div class="public-box-wrap">
        <el-form
          id="myForm"
          ref="freightList"
          label-width="160px"
          label-position="left"
          :model="freightList"
          :rules="rules"
        >
          <div class="detailStockInfo price-stock-wrap mt20">
            <div class="same-header">
              <span class="same-header-left">店铺信息</span>
            </div>
            <div class="detailStockInfo-wrap table-wrap freight">
              <div class="detailBasicInfo-left">
                <el-form-item
                  label="店铺logo："
                  prop="onlyRefunds"
                >
                  <el-upload
                    class="avatars-uploader"
                    :action="$store.state.user.imgUploadApi"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                  >
                    <img
                      v-if="imageUrl"
                      :src="imageUrl == '' ? freightList.logo : imageUrl"
                      class="avatars"
                    >
                    <i
                      v-else
                      class="el-icon-plus avatars-uploader-icon"
                    />
                  </el-upload>
                  <p
                    class="tips"
                    style="margin:0px;"
                  >
                    请保持logo与小程序logo一致
                  </p>
                </el-form-item>
                <!-- <el-form-item label="服务类目：" prop="refunds">
                  <el-input v-model="freightList.refunds" />
                  <p class="tips">请保持服务类目与小程序服务类目一致</p>
                </el-form-item>
                <el-form-item label="  店铺主营：">
                  <el-input
                    style="width:500px;"
                    v-model="freightList.customer"
                    placeholder="请简单描述店铺主营产品"
                  />
                </el-form-item> -->
              </div>
            </div>
          </div>
          <div class="detailBasicInfo">
            <div class="same-header">
              <span class="same-header-left">运费设置</span>
            </div>
            <div class="detailBasicInfo-wrap return-goods">
              <div class="detailBasicInfo-left">
                <el-radio-group v-model="status">
                  <el-radio :label="'3'">
                    运费：
                    <el-input v-model="freightList.freightBasic" />
                    <span class="remarks">元</span>
                  </el-radio>
                  <el-radio :label="'2'">
                    &nbsp;免运费
                  </el-radio>
                </el-radio-group>
              </div>
            </div>
          </div>
          <div class="detailStockInfo price-stock-wrap mt20">
            <div class="same-header">
              <span class="same-header-left">偏远地区设置</span>
            </div>
            <div class="detailStockInfo-wrap table-wrap freight">
              <el-form-item label="偏远地区运费：">
                <el-input v-model="freightList.freightRemote" />
                <span class="remarks">元</span>
              </el-form-item>
              <el-form-item label="选择偏远地区：">
                <el-select
                  v-model="freightRemoteArea"
                  placeholder="请选择地区"
                >
                  <el-option
                    v-for="item in allType"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
                <el-button
                  type="primary"
                  @click="addTags()"
                >
                  添加
                </el-button>
              </el-form-item>
              <div class="tag-box">
                <el-tag
                  v-for="tag in tags"
                  :key="tag"
                  closable
                  type="success"
                  effect="plain"
                  @close="handleClose(tag)"
                >
                  {{ tag }}
                </el-tag>
              </div>
            </div>
          </div>
          <div class="detailBasicInfo">
            <div class="same-header">
              <span class="same-header-left">退货地址</span>
            </div>
            <div class="detailBasicInfo-wrap return-goods">
              <div class="detailBasicInfo-left">
                <el-form-item
                  label="收货人："
                  prop="refundsName"
                >
                  <el-input v-model="freightList.refundsName" />
                </el-form-item>
                <el-form-item
                  label="联系电话："
                  prop="refundsMobile"
                >
                  <el-input v-model="freightList.refundsMobile" />
                </el-form-item>
                <el-form-item
                  label="收货地址："
                  prop="refundsAddress"
                >
                  <el-input v-model="freightList.refundsAddress" />
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="detailStockInfo price-stock-wrap mt20">
            <div class="same-header">
              <span class="same-header-left">退运费设置</span>
            </div>
            <div class="detailStockInfo-wrap table-wrap return-goods">
              <p class="waring-info">
                退货退款时，将根据商家设置的规则自动计算出该退的运费，合计在建议退款金额中。
              </p>
              <el-radio-group v-model="freightList.freightReturn">
                <el-radio :label="0">
                  不退运费
                </el-radio>
                <el-radio :label="1">
                  订单中所有商品全部退回时，退还运费。
                  <p>例：一个订单中有3个商品，用户3个商品都退回时，才退运费；若用户对3个商品分开退回，最后1个商品退回时才退运费。</p>
                </el-radio>
                <el-radio :label="2">
                  订单中每个商品运费分摊退回。
                  <p>例：一个订单中有3个商品，总运费12元，则每个商品分摊的运费为4元，用户退货时，根据商品个数进行退回运费。</p>
                </el-radio>
              </el-radio-group>
            </div>
          </div>
          <div class="detailStockInfo price-stock-wrap mt20">
            <div class="same-header">
              <span class="same-header-left">处理时长设置</span>
            </div>
            <div class="detailStockInfo-wrap table-wrap freight">
              <div class="detailBasicInfo-left">
                <el-form-item
                  label="仅退款处理时长："
                  prop="onlyRefunds"
                >
                  <el-input v-model.number="freightList.onlyRefunds" />&nbsp;天
                  <p class="tips">
                    建议3天，例：用户发起仅退款，若商家3天内未处理，则自动确认退款。
                  </p>
                </el-form-item>
                <el-form-item
                  label="退货退款处理时长："
                  prop="refunds"
                >
                  <el-input v-model.number="freightList.refunds" />&nbsp;天
                  <p class="tips">
                    建议3天，例：用户发起退货退货，若商家3天内未处理，则自动同意退货。
                  </p>
                </el-form-item>
                <el-form-item
                  label="用户退货处理时长："
                  prop="customer"
                >
                  <el-input v-model.number="freightList.customer" />&nbsp;天
                  <p class="tips">
                    建议3天，例：商家同意了用户的退货退款申请，若用户2天内未完成发货，订单则按照正常购物流程继续进行。
                  </p>
                </el-form-item>
                <el-form-item
                  label="商家确认收货时长："
                  prop="logistics"
                >
                  <el-input v-model.number="freightList.logistics" />&nbsp;天
                  <p class="tips">
                    建议7天，例：商家同意退货退款后，用户发货并填写物流信息，若商家7天内（物流一般4天）未处理，则自动确认收货。
                  </p>
                </el-form-item>
                <el-form-item
                  label="确认收货时长："
                  prop="autoReceive"
                >
                  <el-input v-model.number="freightList.autoReceive" />&nbsp;天
                  <p class="tips">
                    建议10天，例：商家发货后10天内，用户未确认收货或发起退款，到期将自动确认收货。
                  </p>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="detailStockInfo price-stock-wrap mt20">
            <div class="same-header">
              <span class="same-header-left">运营设置</span>
            </div>
            <div class="detailStockInfo-wrap table-wrap freight">
              <div class="detailBasicInfo-left">
                <el-form-item
                  label="基础销量设置："
                  prop="baseSales"
                >
                  <el-input v-model.number="freightList.baseSales" />&nbsp;天
                  <p class="tips">
                    小程序展示的“销量”为基础销量加上实际销量的总和，基础销量最多输入9999。
                  </p>
                </el-form-item>
                <el-form-item
                  label="基础浏览量设置："
                  prop="baseBrowse"
                >
                  <el-input v-model.number="freightList.baseBrowse" />&nbsp;天
                  <p class="tips">
                    小程序展示的“多少人想买”为基础浏览量加上实际浏览量的总和，最多输入9999。
                  </p>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="other-operate-btn mt30">
            <el-button
              type="primary"
              @click="submitForm('freightList')"
            >
              保 存
            </el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { getGoodsDetail, updateGoods } from '@/api/commodity'
import { saveShop, getTenantShop } from '@/api/users'
import { formatJson } from '@/utils'
import { Form, Form as ElForm } from 'element-ui'

@Component({
  name: 'Freight',
  components: {}
})
export default class extends Vue {
  private freightList: any = {
    freightBasic: '',
    freightRemote: '',
    refundsName: '',
    refundsAddress: '',
    onlyRefunds: '',
    refunds: '',
    logistics: '',
    baseBrowse: 0,
    baseSales: 0,
    freightReturn: '',
    freightRemoteArea: ''
  };
  private status = '';
  private imageUrl = '';
  private freightRemoteArea = ''; // 偏远地区
  private tags: string[] = [];
  private listLoading: boolean = true;
  private allType = [
    '北京市',
    '天津市',
    '河北省',
    '山西省',
    '内蒙古自治区',
    '辽宁省',
    '吉林省',
    '黑龙江省',
    '上海市',
    '江苏省',
    '浙江省',
    '安徽省',
    '福建省',
    '江西省',
    '山东省',
    '河南省',
    '湖北省',
    '湖南省',
    '广东省',
    '广西壮族自治区',
    '海南省',
    '重庆市',
    '四川省',
    '贵州省',
    '云南省',
    '西藏自治区',
    '陕西省',
    '甘肃省',
    '青海省',
    '宁夏回族自治区',
    '新疆维吾尔自治区',
    '台湾省',
    '香港特别行政区',
    '澳门特别行政区'
  ]; // 所有可选的商品类型
  // 展示主图
  private total = ''; // 查看为true,编辑为false,默认为false

  private check = (rule: any, value: any, callback: any) => {
    var reg = /^(0|[1-9][0-9]*)$/
    if (reg.test(value) && (value > 0 && value < 10000)) {
      callback()
    } else {
      callback(new Error('请输入正确天数!且大于0小于10000'))
    }
  };

  private checkPhone(rule: any, value: any, callback: any) {
    var reg = /^1[3456789]\d{9}$/
    if (reg.test(value)) {
      callback()
    } else {
      callback(new Error('手机号码有误，请重填!'))
    }
  }

  private rules = {
    freightBasic: [
      {
        required: true,
        message: '请输入运费',
        trigger: 'blur'
      }
    ],
    refundsName: [
      {
        required: true,
        message: '请输入退货收货人',
        trigger: 'blur'
      },
      {
        max: 30,
        message: '名称过长'
      }
    ],
    refundsAddress: [
      {
        required: true,
        message: '请输入退货地址',
        trigger: 'blur'
      },
      {
        max: 100,
        message: '地址过长'
      }
    ],
    refundsMobile: [
      {
        required: true,
        message: '请输入退货联系人电话',
        trigger: 'blur'
      },
      {
        validator: this.checkPhone
      }
    ],
    onlyRefunds: [
      {
        required: true,
        message: '请输入仅退款处理时长',
        trigger: 'blur'
      },
      {
        validator: this.check,
        trigger: 'blur'
      }
    ],
    refunds: [
      {
        required: true,
        message: '请输入退货退款处理时长',
        trigger: 'blur'
      },
      {
        validator: this.check,
        trigger: 'blur'
      }
    ],
    logistics: [
      {
        required: true,
        message: '请输入商家收到货时长',
        trigger: 'blur'
      },
      {
        validator: this.check,
        trigger: 'blur'
      }
    ],
    customer: [
      {
        required: true,
        message: '请输入用户退货处理时长',
        trigger: 'blur'
      },
      {
        validator: this.check,
        trigger: 'blur'
      }
    ],
    autoReceive: [
      {
        required: true,
        message: '请输入确认收货时长',
        trigger: 'blur'
      },
      {
        validator: this.check,
        trigger: 'blur'
      }
    ],
    baseSales: [
      { type: 'number', trigger: 'blur', message: '必须为数字值' },
      {
        validator: this.check,
        trigger: 'blur'
      }
    ],
    baseBrowse: [
      { type: 'number', trigger: 'blur', message: '必须为数字值' },
      {
        validator: this.check,
        trigger: 'blur'
      }

    ]
  };

  created() {
    this.getTenantShop()
  }
  private async getTenantShop() {
    this.listLoading = true
    const { data } = await getTenantShop({
      data: {
        id: this.$store.state.user.info.shopId
      }
    })
    this.freightList = data.data
    if (this.freightList.freightBasic == '0') {
      this.status = '2'
    } else {
      this.status = '3'
    }
    if (this.freightList.freightRemoteArea) {
      this.tags = this.freightList.freightRemoteArea.split(',')
    }
    this.freightList.onlyRefunds = this.computeDate(this.freightList.onlyRefunds, 'get')
    this.freightList.refunds = this.computeDate(this.freightList.refunds, 'get')
    this.freightList.customer = this.computeDate(this.freightList.customer, 'get')
    this.freightList.logistics = this.computeDate(this.freightList.logistics, 'get')
    this.freightList.autoReceive = this.computeDate(this.freightList.autoReceive, 'get')
    this.imageUrl = this.freightList.logo
    setTimeout(() => {
      this.listLoading = false
    }, 0.5 * 1000)
  }

  // 获取偏远地区
  private handleClose(tag: any) {
    this.tags.splice(this.tags.indexOf(tag), 1)
  }
  // 获取偏远地区
  private addTags() {
    this.tags.push(this.freightRemoteArea)
  }

  private handleCreate() {
    this.$nextTick(() => {
      (this.$refs['dataForm'] as Form).clearValidate()
    })
  }

  private computeDate(time, type) { // 换算时间
    // 天换秒
    if (type == 'save') {
      return time * 24 * 60 * 60
    } else {
      return time / 24 / 60 / 60
    }
  }

  // 添加商品列表请求提交
  private async saveShop() {
    if (this.status == '2') {
      this.freightList.freightBasic = '0'
    }
    if (this.tags.length > 0) {
      this.freightList.freightRemoteArea = this.tags.join(',')
    }
    let formData = JSON.parse(JSON.stringify(this.freightList))
    formData.onlyRefunds = this.computeDate(this.freightList.onlyRefunds, 'save')
    formData.refunds = this.computeDate(this.freightList.refunds, 'save')
    formData.customer = this.computeDate(this.freightList.customer, 'save')
    formData.logistics = this.computeDate(this.freightList.logistics, 'save')
    formData.autoReceive = this.computeDate(this.freightList.autoReceive, 'save')
    formData.logo = this.imageUrl
    const { data } = await saveShop({
      data: formData
    })
    this.postMeg(data.resultCode, data.resultInfo)
  }

  // 提交请求，后续处理
  private postMeg(code: number, info: string) {
    this.$message({
      message: info,
      type: code == 1 ? 'success' : 'warning'
    })
    setTimeout(() => {
      code == 1 && this.getTenantShop()
    }, 1000)
  }

  private handleAvatarSuccess(res: any, file: any) {
    // this.imageUrl = URL.createObjectURL(file.raw);
    this.imageUrl = res.data[0]
  }
  private beforeAvatarUpload(file: any) {
    const isJPG = file.type === 'image/jpeg'
    const isPNG = file.type === 'image/png'
    const isLt2M = file.size / 1024 / 1024 < 2

    if (!isJPG && !isPNG) {
      this.$message.error('上传图片只能是 JPG 和 PNG 格式!')
    }
    if (!isLt2M) {
      this.$message.error('上传图片大小不能超过 2MB!')
    }
    return (isJPG || isPNG) && isLt2M
  }

  // 事件-提交表单
  private submitForm(freightList: any) {
    (this.$refs[freightList] as ElForm).validate((valid: boolean) => {
      if (valid) {
        this.saveShop()
      } else {
        return false
      }
    })
  }
}
</script>
<style lang="scss" scoped>
@import "@/styles/detail.scss";
.el-form-item {
  .el-button {
    margin-left: 20px;
  }
}
.tag-box {
  margin-left: 150px;
  .el-tag {
    margin-left: 10px;
  }
}
.waring-info {
  margin-top: 0px;
  margin-bottom: 24px;
}
.return-goods {
  .el-radio-group {
    .el-radio {
      display: block;
      margin: 14px 0;
      .el-input {
        width: 100px;
      }
      p {
        display: inline-block;
        color: #aaa;
      }
    }
  }
}
.tips {
  display: inline-block;
  margin: 0 20px;
  color: #aaa;
}
.avatars-uploader {
  margin-bottom: 12px;
}
.avatars-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatars-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatars-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatars {
  width: 120px;
  height: 120px;
  display: block;
}
</style>
