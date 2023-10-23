<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          :disabled="multiple"
          @click="handleExport"
          >导出</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>

      <el-col :span="1.5">
        <el-cascader
          :props="{ expandTrigger: 'hover' }"
          class="el-input"
          :options="options"
          placeholder="默认显示为本学期"
          @change="handleYearFilter"
        ></el-cascader>
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="infoList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" prop="id" />
      <el-table-column label="性别" align="center" prop="sex" />
      <el-table-column label="专业班级" align="center" prop="major_class" />
      <el-table-column label="姓名" align="center" prop="student_name" />
      <el-table-column label="学号" align="center" prop="student_number" />
      <el-table-column label="手机号" align="center" prop="phone" />
      <el-table-column label="QQ" align="center" prop="qq" />
      <el-table-column label="报名年份" align="center" prop="year" />
      <el-table-column label="邮箱" align="center" prop="email" />
      <el-table-column label="提交时间" align="center" prop="sign_time">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.sign_time, "{y}.{m}.{d}") }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['hr:info:edit']"
            >修改</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改项目管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="学号" prop="student_number">
          <el-input v-model="form.student_number" placeholder="请输入学号" />
        </el-form-item>
        <el-form-item label="姓名" prop="student_name">
          <el-input v-model="form.student_name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="专业班级" prop="major_class">
          <el-input v-model="form.major_class" placeholder="请输入专业班级" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <span>
            <el-radio-group v-model="form.sex">
              <el-radio label="男">男</el-radio>
              <el-radio label="女">女</el-radio>
            </el-radio-group>
          </span>
        </el-form-item>
        <el-form-item label="QQ" prop="qq">
          <el-input v-model="form.qq" placeholder="请输入QQ" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="报名年份" prop="year">
          <el-select
            v-model="form.year"
            @change="handleChange"
            placeholder="请输入报名年份"
            size="mini"
          >
            <el-option v-for="y in yearOptions" :key="y" :value="y">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="提交时间" prop="sign_time">
          <el-date-picker
            v-model="form.sign_time"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="请选择提交时间"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
let date = new Date().getFullYear();
import {
  listInfo,
  getInfo,
  delInfo,
  addInfo,
  updateInfo,
  ListByYear,
  Download,
} from "@/api/info";
import { parseTime } from "../utils/ruoyi";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "info",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 5,
      // 项目管理表格数据
      infoList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 999,
        id: null,
      },
      // 表单参数
      form: {},
      //表单检验
      selectedYear: "",
      //添加的报名年份筛选下拉表单的绑定数据
      yearOptions: [date - 3, date - 2, date - 1, date],
      // 报名年份的选项数组
      options: [
        {
          value: date,
          label: date,
          children: [
            {
              value: 1,
              label: "上半学期",
            },
            {
              value: 2,
              label: "下半学期",
            },
            {
              value: -1,
              label: "整学年",
            },
          ],
        },
        {
          value: date - 1,
          label: date - 1,
          children: [
            {
              value: 1,
              label: "上半学期",
            },
            {
              value: 2,
              label: "下半学期",
            },
            {
              value: -1,
              label: "整学年",
            },
          ],
        },
        {
          value: date - 2,
          label: date - 2,
          children: [
            {
              value: 1,
              label: "上半学期",
            },
            {
              value: 2,
              label: "下半学期",
            },
            {
              value: -1,
              label: "整学年",
            },
          ],
        },
        {
          value: date - 3,
          label: date - 3,
          children: [
            {
              value: 1,
              label: "上半学期",
            },
            {
              value: 2,
              label: "下半学期",
            },
            {
              value: -1,
              label: "整学年",
            },
          ],
        },
        {
          value: 0,
          label: "全部数据",
        },
      ],
      // 表单校验
      rules: {
        student_number: [
          { required: true, message: "学号不能为空", trigger: "blur" },
        ],
        student_name: [
          { required: true, message: "姓名不能为空", trigger: "blur" },
        ],
        major_class: [
          { required: true, message: "专业班级不能为空", trigger: "blur" },
        ],
        sex: [
          {
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error("请选择性别"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        qq: [{ required: true, message: "QQ不能为空", trigger: "blur" }],
        email: [
          { required: true, message: "邮箱不能为空", trigger: "blur" },
          {
            type: "email",
            message: "请输入有效的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        year: [
          { required: true, message: "报名年份不能为空", trigger: "blur" },
        ],
        phone: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          { len: 11, message: "手机号格式错误", trigger: "blur" },
        ],
        sign_time: [
          { required: true, message: "提交时间不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    parseTime,
    /** 查询项目管理列表 */
    getList() {
      this.loading = false;
      let half = new Date().getMonth() < 7 ? 1 : 2;
      ListByYear(date, half, this.queryParams).then((response) => {
        if (response.status_code === 10000) {
          this.infoList = response.data.array;
          this.total = response.data.item_total;
          this.loading = false;
        }
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        student_number: null,
        student_name: null,
        major_class: null,
        sex: null,
        qq: null,
        phone: null,
        email: null,
        year: null,
        last_ip: null,
        sign_time: null,
        status: null,
      };
      this.resetForm("form");
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加报名信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id;
      getInfo(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改学生信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.sign_time = new Date(this.form.sign_time + "T00:00:00Z");
          if (this.form.id != null) {
            this.form.sign_time = updateInfo(this.form).then(() => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addInfo(this.form).then(() => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete() {
      const ids = this.ids;
      this.$modal
        .confirm("是否确认删除")
        .then(function () {
          return delInfo({ ids });
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },

    /** 导出按钮操作 */
    handleExport() {
      const ids = this.ids;
      Download({ ids }).then((response) => {
        if (response.status_code === 10000) {
          this.download(
            "/file/export",
            `info_${parseTime(new Date().getTime(), "{y}.{m}.{d}")}.xlsx`
          );
        }
      });
    },

    // 报名年份筛选操作
    handleYearFilter(value) {
      if (value[0] == 0 && typeof value[1] == "undefined") {
        this.loading = false;
        listInfo(this.queryParams).then((response) => {
          if (response.status_code === 10000) {
            this.infoList = response.data.array;
            this.total = response.data.item_total;
            this.loading = false;
          }
        });
      } else {
        ListByYear(value[0], value[1], this.queryParams).then((response) => {
          if (response.status_code === 10000) {
            this.infoList = response.data.array;
            this.total = response.data.item_total;
            this.loading = false;
          }
        });
      }
    },

    changeSignTime(val) {
      this.$forceUpdate();
      this.form.sign_time = val;
    },
  },
};
</script>
