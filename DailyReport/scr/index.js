let deleteDialog = document.getElementById("delete__dialog");
let inputData = new Object();
let fileName;
let sendData = new Object();
let ajaxReturnData;
let from_import = false;
let from_import_data = "";

const myAjax = {
  myAjax: function (fileName, sendData) {
    $.ajax({
      type: "POST",
      url: "./php/"+fileName,
      dataType: "json",
      data: sendData,
      async: false,
    })
      .done(function (data) {
        ajaxReturnData = data;
      })
      .fail(function (err) {
        console.error("AJAX lỗi [" + fileName + "]:", err.responseText);
        ajaxReturnData = []; // PATCH: tránh undefined làm crash fillTableBody/forEach phía sau
      });
  },
};

const getTwoDigits = (value) => value < 10 ? `0${value}` : value;
const getDateTime = (date) => {
    const day = getTwoDigits(date.getDate());
    const month = getTwoDigits(date.getMonth() + 1);
    const year = date.getFullYear();
    const hours = getTwoDigits(date.getHours());
    const mins = getTwoDigits(date.getMinutes());
    return `${year}${month}${day}${hours}${mins}00`;
}
makeSummaryTable()
selStaffDrawing();
selStaffCutting();
SelDrawingType();
SelProductionNumber();
SelStatus();

function SelDrawingType() {
  var fileName = "SelDrawingType.php";
  var sendData = {

  };
  myAjax.myAjax(fileName, sendData);
  $("#drawing_type_id option").remove();
  $("#drawing_type_id").append($("<option>").val(0).html("NO"));
  ajaxReturnData.forEach(function(value) {
      $("#drawing_type_id").append(
          $("<option>").val(value["id"]).html(value["m_drawing_type"])
      );
  });
  ajaxReturnData.forEach(function(value) {
    $("#production_type_filter").append($("<option>").val(0).html("NO"));
    $("#production_type_filter").append(
        $("<option>").val(value["id"]).html(value["m_drawing_type"])
    );
});
};
function selStaffDrawing() {
  var fileName = "SelStaff.php";
  var sendData = {
    staff: $("#staff").val(),
  };
  myAjax.myAjax(fileName, sendData);
  $("#staff_id option").remove();
  $("#staff_id").append($("<option>").val(0).html("NO"));
  ajaxReturnData.forEach(function(value) {
      $("#staff_id").append(
          $("<option>").val(value["id"]).html(value["name"])
      );
  });
};
function selStaffCutting() {
  var fileName = "SelStaff.php";
  var sendData = {
    staff: $("#staff_cut").val(),
  };
  myAjax.myAjax(fileName, sendData);
  $("#cutting_staff_id option").remove();
  $("#cutting_staff_id").append($("<option>").val(0).html("NO"));
  ajaxReturnData.forEach(function(value) {
      $("#cutting_staff_id").append(
          $("<option>").val(value["id"]).html(value["name"])
      );
  });
};
function SelProductionNumber() {
  var fileName = "SelProductionNumber.php";
  var sendData = {
    production_number: $("#production_number").val(),
  };
  myAjax.myAjax(fileName, sendData);
  $("#production_number_id option").remove();
  $("#production_number_id").append($("<option>").val(0).html("NO"));
  ajaxReturnData.forEach(function(value) {
      $("#production_number_id").append(
          $("<option>").val(value["id"] + "-" + value["ex_production_numbers_id"]).html(value["production_number"])
      );
  });
  SelDies();
  SelPlugs();
};
function separateString(deviceString, position) {
  const deviceParts = deviceString.split("-");
  return deviceParts[position - 1];
};
function SelDies() {
  if($("#production_number_id").val() != 0) {
    var fileName = "SelDies.php";
    var sendData = {
      die_number: $("#die_number").val(),
      ex_production_numbers_id: separateString($("#production_number_id").val(), 2),
    };
    console.log(sendData)
    myAjax.myAjax(fileName, sendData);
    $("#die_number_id option").remove();
    $("#die_number_id").append($("<option>").val(0).html("NO"));
    ajaxReturnData.forEach(function(value) {
        $("#die_number_id").append(
            $("<option>").val(value["id"]).html(value["die_number"])
        );
    });
  }
};
function SelPlugs() {
  if($("#production_number_id").val() != 0) {
    var fileName = "SelPlugs.php";
    var sendData = {
      plug_number: $("#plug_number").val(),
      ex_production_numbers_id: separateString($("#production_number_id").val(), 2),
    };
    myAjax.myAjax(fileName, sendData);
    $("#plug_number_id option").remove();
    $("#plug_number_id").append($("<option>").val(0).html("NO"));
    ajaxReturnData.forEach(function(value) {
        $("#plug_number_id").append(
            $("<option>").val(value["id"]).html(value["plug_number"])
        );
    });
  }
};
function SelStatus() {
  var fileName = "SelStatus.php";
  var sendData = {
  };
  myAjax.myAjax(fileName, sendData);
  $("#die_status_id option").remove();
  $("#die_status_id").append($("<option>").val(0).html("NO"));
  ajaxReturnData.forEach(function(value) {
      $("#die_status_id").append(
          $("<option>").val(value["id"]).html(value["status"])
      );
  });
  $("#plug_status_id option").remove();
  $("#plug_status_id").append($("<option>").val(0).html("NO"));
  ajaxReturnData.forEach(function(value) {
      $("#plug_status_id").append(
          $("<option>").val(value["id"]).html(value["status"])
      );
  });
};

$(document).on("change", "#press_date", function() {
  if ($(this).val() != "") {
    makePressSelect();
  } else {
  }
});
function makePressSelect() {
  var fileName = "SelPress.php";
  var sendData = {
    press_date: $("#press_date").val(),
    production_number_id: separateString($("#production_number_id").val(), 2),
  };
  myAjax.myAjax(fileName, sendData);
  $("#press_id option").remove();
  $("#press_id").append($("<option>").val(0).html("NO"));
  ajaxReturnData.forEach(function(value) {
      $("#press_id").append(
          $("<option>").val(value["id"]).html(value["die_number"])
      );
  });
  $("#select_rack_table tbody").empty();
};
$(document).on("change", "#press_id", function() {
  if ($(this).val() != 0) {
    makePressTable();
  } else {
  }
});
$(document).on("keyup", "#production_number", function() {
  SelProductionNumber();
});
$(document).on("change", "#production_number_id", function() {
  SelDies();
  SelPlugs();
});
$(document).on("keyup", "#die_number", function() {
  SelDies();
});
$(document).on("keyup", "#plug_number", function() {
  SelPlugs();
});
$(document).on("keyup", "#staff", function() {
  selStaffDrawing();
});
$(document).on("keyup", "#staff_cut", function() {
  selStaffCutting();
});
function makePressTable() {
  var fileName = "SelRack.php";
  var sendData = {
    press_id: $("#press_id").val(),
  };
  myAjax.myAjax(fileName, sendData);
  fillTableBody(ajaxReturnData, $("#select_rack_table tbody"));
};
function selRackByDrawing() {
  var fileName = "SelRackByDrawing.php";
  var sendData = {
    drawing_id: $("#selected__tr").find("td").eq(0).html(),
  };
  myAjax.myAjax(fileName, sendData);
  fillTableBody(ajaxReturnData, $("#input_rack_table tbody"));
};
function selCutByDrawing() {
  var fileName = "SelCutByDrawing.php";
  var sendData = {
    drawing_id: $("#selected__tr").find("td").eq(0).html(),
  };
  myAjax.myAjax(fileName, sendData);
  fillTableBody(ajaxReturnData, $("#profile_cut_table tbody"));
};

/* ════════════════════════════════════════════════
   PATCH B7+B8 — Rack KHÔNG biến mất sau khi chọn.
   Max tự trừ theo Qty đã lấy, có thể lấy thêm lần sau.
   Đồng thời sinh dữ liệu cây thành phẩm (input_order, piece_code)
   gửi kèm khi Save (qua InsRackData.php v2).
════════════════════════════════════════════════ */
$(document).off("click", "#select_rack_table tbody tr");
$(document).on("click", "#select_rack_table tbody tr", function() {
  if (!$(this).hasClass("selected-record")) {
    $(this).parent().find("tr").removeClass("selected-record");
    $(this).addClass("selected-record");
    $("#rack_selected").removeAttr("id");
    $(this).attr("id", "rack_selected");
    return;
  }

  const rack_id = $(this).find("td:nth-child(1)").html();
  const rack_number = $(this).find("td:nth-child(2)").html();
  const qty = parseInt($(this).find("td:nth-child(3) input").val(), 10) || 0;
  const $maxCell = $(this).find("td:nth-child(4)");
  const currentMax = parseInt($maxCell.html(), 10) || 0;

  if (qty <= 0) {
    alert("Vui lòng nhập số lượng lấy từ rack trước khi chọn.");
    return;
  }
  if (qty > currentMax) {
    alert("Số lượng vượt quá tồn kho hiện có trên rack (" + currentMax + ").");
    return;
  }
  if (checkRackId(rack_id)) {
    // Rack này đã có dòng trong input_rack_table — cộng dồn quantity vào dòng đó
    let existingRow = null;
    $("#input_rack_table tbody tr").each(function() {
      if ($(this).find("td:first").html() == rack_id) existingRow = $(this);
    });
    if (existingRow) {
      const oldQty = parseInt(existingRow.find("td:nth-child(4)").html(), 10) || 0;
      existingRow.find("td:nth-child(4)").html(oldQty + qty);
    }
  } else {
    const press_date = $("#press_date").val();
    const newTr = $("<tr>");
    $("<td>").html(rack_id).appendTo(newTr);
    $("<td>").html(press_date).appendTo(newTr);
    $("<td>").html(rack_number).appendTo(newTr);
    $("<td>").html(qty).appendTo(newTr);
    newTr.appendTo("#input_rack_table tbody");
  }

  // Trừ Max ngay trên dòng (KHÔNG xóa dòng khỏi select_rack_table)
  $maxCell.html(currentMax - qty);
  $(this).find("td:nth-child(3) input").val(1); // reset ô nhập về 1 cho lần lấy tiếp theo
  $(this).removeClass("selected-record").removeAttr("id");

  if (currentMax - qty <= 0) {
    $(this).addClass("row-out-of-stock");
    $(this).css("pointer-events", "none");
  }
});
$(document).on("change", "#select_rack_table tbody tr", function() {
  // Lấy giá trị số lượng từ ô thứ 3 của mỗi hàng trong bảng
  let qty = Number($(this).find("td:nth-child(3) input").val());
  // Lấy giá trị số lượng tối đa từ ô thứ 4 của mỗi hàng trong bảng
  let max_qty = Number($(this).find("td:nth-child(4)").html());
  // Kiểm tra xem số lượng có vượt quá số lượng tối đa không
  if (qty > max_qty) {
    // Nếu vượt quá, đặt số lượng về số lượng tối đa
    $(this).find("td:nth-child(3) input").val(max_qty);
  } else if (qty <= 1){
    // Nếu số lượng nhỏ hơn hoặc bằng 1, đặt số lượng về 1
    $(this).find("td:nth-child(3) input").val(1);
  } else {
    // Nếu không thuộc các trường hợp trên, không có hành động nào được thực hiện
  }
});

function checkRackId(rack_id) {
  exist = false;
  $("#input_rack_table tbody tr").each(function (index, element) {
      ip_id = $(this).find("td:first").html();
      if(ip_id == rack_id) exist = true;
  });
  return exist;
};

$(document).on("click", "#input_rack_table tbody tr", function() {
  if (!$(this).hasClass("selected-record")) {
    $(this).parent().find("tr").removeClass("selected-record");
    $(this).addClass("selected-record");
  } else {
    $(this).remove();
    $("#profile_cut_table tbody").empty();
  }
});
$(document).on("click", "#delete-rack-cancel__button", function () {
  let deleteDialog = document.getElementById("delete-rack__dialog");
  deleteDialog.close();
});

$(document).on("click", "#delete-rack-delete__button", function () {
  let deleteDialog = document.getElementById("delete-rack__dialog");
  let sendData = new Object();
  let fileName = "DelSelRackData.php";
  sendData = {
    t_using_aging_rack_id: $("#rack_selected__tr").find("td").eq(0).html(),
  };
  myAjax.myAjax(fileName, sendData);
  deleteDialog.close();
  makeRackTable();
});
$(document).on("keyup", "#profile_cut_table input", function () {
  if (0 < Number($(this).val()) &&
    Number($(this).val()) <= 20 &&
    $(this).val() != "") {
    $(this).removeClass("no-input").addClass("complete-input");
  } else {
    $(this).removeClass("complete-input").addClass("no-input");
  }
});
$(document).on("click", "#add_cut_button", function () {
  if (Number($("#input_rack_table tbody tr").length) == 0) {
    alert("Please select input rack!");
    return;
  }
  maxSumCut = 0;
  sum = 0;
  $("#input_rack_table tbody tr td:nth-child(4)").each(function (index, value) {
    maxSumCut += Number($(this).text());
  });
  let trDom = $("<tr>");
  let recordNumber = Number($("#profile_cut_table tbody tr").length) + 1;

  if (recordNumber > maxSumCut) {
    alert("Number input is bigger than input quantity!");
    return;
  };
  let rack_number = makeRackNumber(recordNumber);
  trDom.append($("<th>").html("No." + recordNumber));
    let tdDom;
    trDom.append($("<td>").html(rack_number));
    tdDom = $("<td>").append($("<input type='number'>").val($("#profile_cut_ok").val()).addClass("no-input need-clear"));
    trDom.append(tdDom);
    tdDom = $("<td>").append($("<input type='number'>").val($("#profile_cut_ng").val()).addClass("no-input need-clear"));
    trDom.append(tdDom);
  trDom.appendTo("#profile_cut_table");
});
function makeRackNumber(recordNumber) {
  var quantity = 0;
  var rack_number = 0;
  var sum = 0;
  var table = document.getElementById("input_rack_table");
  var tbody = table.getElementsByTagName("tbody")[0];
  var tr = tbody.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
      rack_number = tr[i].getElementsByTagName("td")[2].innerText;
      quantity = tr[i].getElementsByTagName("td")[3].innerText;
      sum = +quantity;
      if (recordNumber <= sum) {
        break;
      }
  }
  return rack_number;
};
function makeSendData(workInfrmationTable) {
  sendTable = [];
  workInfrmationTable.forEach(function (element, index) {
    sendTable.push([index + 1, 1, element[0], element[1]]);
  });
  return sendTable;
}

$("#file_upload").on("change", function () {
  var file = $(this).prop("files")[0];
  $("#file_url").html(getDateTime(new Date())+file.name);
  $("#preview__button").prop("disabled", false);
});
$(document).on("click", "#preview__button", function () {
  window.open("./DailyReportSub.html");
});
$(document).on("change", "#file_upload", function () {
  ajaxFileUpload();
});
function ajaxFileUpload() {
    var file_data = $('#file_upload').prop('files')[0];
    var form_data = new FormData();
    form_data.append('file', file_data);
    form_data.append('sub_name', getDateTime(new Date()));
    $.ajax({
        url: "./php/FileUpload.php",
        dataType: 'text',
        cache: false,
        contentType: false,
        processData: false,
        data: form_data,
        type: 'post',
    });
}

$(document).on("change", "#ordersheet_id", function () {
  SelDies();
  SelPlugs();
  $("#select_rack_table tbody").empty();
  $("#input_rack_table tbody").empty();
  $("#profile_cut_table tbody").empty();
  $("#press_id option").remove();
  $("#press_date").val("");
});
$(document).on("change", "#production_number_id", function () {
  $("#ordersheet_id option").remove();
  $("#select_rack_table tbody").empty();
  $("#input_rack_table tbody").empty();
  $("#profile_cut_table tbody").empty();
  $("#press_id option").remove();
  $("#press_date").val("");
});

$(document).on("change keyup", ".no-input", function() {
  if (($(this).val() == "") || ($(this).val() == 0)) {
      $(this).removeClass("complete-input").addClass("no-input");
  } else {
      $(this).removeClass("no-input").addClass("complete-input");
  }
});
$(document).on("change keyup", ".complete-input", function() {
  if (($(this).val() == "") || ($(this).val() == 0)) {
      $(this).removeClass("complete-input").addClass("no-input");
  } else {
      $(this).removeClass("no-input").addClass("complete-input");
  }
});
$(document).on("keyup", ".number-input", function() {
  if($.isNumeric($(this).val())){
      $(this).removeClass("no-input").addClass("complete-input");
  } else {
      $(this).removeClass("complete-input").addClass("no-input");
  }
  checkInput();
  checkUpdate();
});
$(document).on("click", "#select_ordersheet", function () {
  window.open(
    "./OrderSheet.html",
    null,
    "width=830, height=500,toolbar=yes,menubar=yes,scrollbars=no"
  );
});

function checkInput() {
  var check = true;
  $(".left__wrapper .save-data").each(function() {
    if ($(this).hasClass("no-input")) {
      check = false;
    }
  });
  $(".left__wrapper select").each(function() {
    if ($(this).hasClass("no-input")) {
      check = false;
    }
  });
  if ($("#summary__table tbody tr").hasClass("selected-record")) {
    check = false;
  }
  if (Number($("#input_rack_table tbody tr").length) == 0) {
    check = false;
  }
  if (Number($("#profile_cut_table tbody tr").length) == 0) {
    check = false;
  }
  if (check) {
    $("#save__button").attr("disabled", false);
  } else {
    $("#save__button").attr("disabled", true);
  }
  return check;
};
function checkUpdate() {
  var check = true;
  $(".left__wrapper .save-data").each(function() {
    if ($(this).hasClass("no-input")) {
      check = false;
    }
  });
  if (!($("#summary__table tbody tr").hasClass("selected-record"))) {
    check = false;
  }
  if (check) {
    $("#update__button").attr("disabled", false);
  } else {
    $("#update__button").attr("disabled", true);
  };
  return check;
};

function makeSummaryTable() {
  var fileName = "SelSummary.php";
  var sendData = {
      dummy: "dummy",
  };
  myAjax.myAjax(fileName, sendData);
  fillTableBody(ajaxReturnData, $("#summary__table tbody"));
};
function fillTableBody(data, tbodyDom) {
  $(tbodyDom).empty();
  if (!Array.isArray(data)) {
    console.error("fillTableBody nhận data không hợp lệ (không phải array):", data);
    return; // PATCH: tránh crash khi PHP trả lỗi/null thay vì JSON array
  }
  data.forEach(function(trVal) {
      let newTr = $("<tr>");
      Object.keys(trVal).forEach(function(tdVal, index) {
          // $("<td>").html(trVal[tdVal]).appendTo(newTr);
          if (tdVal == "order_number") {
            $("<th>").html("No." + trVal[tdVal]).appendTo(newTr);
          } else if ((tdVal == "ng_quantityyy") || (tdVal == "ok_quantityyy")) {
            $("<td>").append($("<input type='number'>").val(trVal[tdVal]).addClass("need-clear complete-input")).appendTo(newTr);
          } else if ((tdVal == "ok_qty")) {
            $("<td>").append($("<input type='number'>").val(trVal[tdVal]).addClass("need-clear complete-input")).appendTo(newTr);
          } else {
            $("<td>").html(trVal[tdVal]).appendTo(newTr);
          }
      });
      $(newTr).appendTo(tbodyDom);
  });
};
$(document).on("click", "#summary__table tbody tr", function (e) {
  let fileName = "SelUpdateData.php";
  let sendData;
  if (!$(this).hasClass("selected-record")) {
    $(this).parent().find("tr").removeClass("selected-record");
    $(this).addClass("selected-record");
    $("#selected__tr").removeAttr("id");
    $(this).attr("id", "selected__tr");
    sendData = {
      targetId: $("#selected__tr").find("td").eq(0).html(),
    };
    myAjax.myAjax(fileName, sendData);
    putDataToInput(ajaxReturnData);
    $("#add_rack__button").text("Add");
    selRackByDrawing();
    selCutByDrawing();
  } else {
    // deleteDialog.showModal();
  }
  $("#save__button").attr("disabled", true);
  $("#preview__button").attr("disabled", false);
  $(".save-data").each(function (index, element) {
    $(this).removeClass("no-input").addClass("complete-input");
  });
  checkUpdate();
});
function getTableData(tableTrObj) {
  var tableData = [];
  tableTrObj.each(function (index, element) {
    var tr = [];
    $(this).find("td").each(function (index, element) {
      if ($(this).find("input").length) {
        tr.push($(this).find("input").val());
      } else if ($(this).find("select").length) {
        tr.push($(this).find("select").val());
      } else {
        tr.push($(this).html());
      }
    });
    tr.push(index + 1);
    tableData.push(tr);
  });
  return tableData;
};

$(document).on("keyup", ".number-input", function() {
  if($.isNumeric($(this).val())){
      $(this).removeClass("no-input").addClass("complete-input");
  } else {
      $(this).removeClass("complete-input").addClass("no-input");
  }
  checkInput();
  checkUpdate();
});
$(document).on("keyup change", ".save-data", function() {
  checkInput();
  checkUpdate();
});

function getInputData() {
  let inputData = new Object();
  $(".left__wrapper input.save-data").each(function (index, element) {
    inputData[$(this).attr("id")] = $(this).val();
  });
  $(".left__wrapper select.save-data").each(function (index, element) {
    inputData[$(this).attr("id")] = $(this).val();
  });
  if ($("#file_upload").prop("files")[0]) {
    inputData["file_url"] = $("#file_url").html();
    ajaxFileUpload();
  } else {
    inputData["file_url"] = $("#file_url").html();
  }
  inputData["production_number_id"] = separateString($("#production_number_id").val(), 1);
  return inputData;
};
function clearInputData() {
  $(".left__wrapper input.need-clear").each(function (index, element) {
    $(this).val("").removeClass("complete-input").addClass("no-input");
  });
  $(".left__wrapper select.need-clear").each(function (index, element) {
    $(this).val("0").removeClass("complete-input").addClass("no-input");
  });
  $(".left__wrapper input.no-need").each(function (index, element) {
    $(this).removeClass("no-input").addClass("complete-input");
  });
  $(".left__wrapper select.no-need").each(function (index, element) {
    $(this).removeClass("no-input").addClass("complete-input");
  });

  $("#file_url").html("No file");

  $("#input_rack_table tbody").empty();
  $("#profile_cut_table tbody").empty();
}

$(document).on("click", "#save__button", function () {
  fileName = "InsData.php";
  inputData = getInputData();
  sendData = inputData;
  myAjax.myAjax(fileName, sendData);
  let targetId = ajaxReturnData[0]["id"];
  inputTableData = getTableData($("#input_rack_table tbody tr"));
  inputTableData.push(targetId);
  fileName = "InsRackData.php";
  sendData = JSON.stringify(inputTableData);
  console.log(sendData);
  myAjax.myAjax(fileName, sendData);

  cutTableData = getTableData($("#profile_cut_table tbody tr"));
  cutTableData.push(targetId);
  fileName = "InsCutData.php";
  sendData = JSON.stringify(cutTableData);
  console.log(sendData);
  myAjax.myAjax(fileName, sendData);
  $("#save__button").attr("disabled", true);
  clearInputData();
  makeSummaryTable();
});
$(document).on("click", "#update__button", function () {
  fileName = "UpdateData.php";
  inputData = getInputData();
  inputData["targetId"] = $("#selected__tr").find("td").eq(0).html();
  sendData = inputData;
  myAjax.myAjax(fileName, sendData);
  clearInputData();
  makeSummaryTable();
  $("#update__button").attr("disabled", true);
});
function putDataToInput(data) {
  data.forEach(function (trVal) {
    Object.keys(trVal).forEach(function (tdVal) {
      $("#" + tdVal).val(trVal[tdVal]);
    });
    SelDies();
    SelPlugs();
    $("#die_number_id").val(trVal["die_number_id"]); 
    $("#plug_number_id").val(trVal["plug_number_id"]); 
  });
  $("#file_url").html(data[0].file_url);
};
$(document).on("click", "#directive__input", function () {
  window.open(
    "./OrderSheet.html",
    null,
    "width=830, height=500,toolbar=yes,menubar=yes,scrollbars=no"
  );
});
/* ════════════════════════════════════════════════════════════
   ═══ PATCH TỔNG HỢP v5 — Tất cả cải tiến hợp nhất, không trùng lặp ═══
   1. Admin mode + nút Sửa OK/NG trong summary table
   2. Highlight dòng NG>0 + KPI bar + Filter Term + Loading spinner + Enter-to-next
   3. Bảng chọn lô ép tự động theo Mã SP (thay quy trình gõ tay press_date)
════════════════════════════════════════════════════════════ */

/* ───────────────────────────────────────────
   HOOK DUY NHẤT vào fillTableBody — gộp tất cả
   logic cần chạy sau khi 1 bảng được render,
   tránh khai báo const trùng tên nhiều lần
─────────────────────────────────────────── */
const _origFillTableBody = fillTableBody;
let _summaryRawData = [];

fillTableBody = function(data, tbodyDom) {
  _origFillTableBody(data, tbodyDom);

  if ($(tbodyDom).is("#summary__table tbody")) {
    _summaryRawData = data;
    _decorateSummaryRows(data, tbodyDom);
    updateKPIBar(data);
  }
};

/* ───────────────────────────────────────────
   1. ADMIN MODE + NÚT SỬA + HIGHLIGHT NG
─────────────────────────────────────────── */
const ADMIN_KEY = "tube_drawing_admin_mode";
function isAdminMode() {
  return localStorage.getItem(ADMIN_KEY) === "1";
}
function toggleAdminMode() {
  const cur = isAdminMode();
  localStorage.setItem(ADMIN_KEY, cur ? "0" : "1");
  $("#admin_toggle_btn").text(!cur ? "🔓 Admin ON" : "🔒 Admin");
  makeSummaryTable();
}

function _decorateSummaryRows(data, tbodyDom) {
  $(tbodyDom).find("tr").each(function(i) {
    const rowData = data[i];
    if (!rowData) return;

    // Highlight NG > 0
    if (Number(rowData.total_ng) > 0) {
      $(this).addClass("row-has-ng");
    }

    // Cột "Sửa" — nút admin hoặc badge "đã sửa"
    const drawingId = rowData.id;
    const okVal = rowData.total_ok || 0;
    const ngVal = rowData.total_ng || 0;
    const isManual = rowData.is_manual == 1;
    const $actionTd = $("<td>").addClass("action-cell");

    if (isAdminMode()) {
      const $btn = $("<button>")
        .text("✏️")
        .css({ padding: "2px 8px", minWidth: "auto", fontSize: "11px" })
        .on("click", function(e) {
          e.stopPropagation();
          const newOk = prompt("Sửa số lượng OK:", okVal);
          if (newOk === null) return;
          const newNg = prompt("Sửa số lượng NG:", ngVal);
          if (newNg === null) return;
          if (!$.isNumeric(newOk) || !$.isNumeric(newNg)) {
            alert("Vui lòng nhập số hợp lệ");
            return;
          }
          $.ajax({
            type: "POST",
            url: "./php/UpdateSummaryQty.php",
            dataType: "json",
            data: {
              drawing_id: drawingId,
              ok_quantity: newOk,
              ng_quantity: newNg,
              editor_staff_id: $("#staff_id").val() || 0
            },
            async: false
          }).done(function(res) {
            if (res.error) {
              alert("Lỗi: " + res.error);
            } else {
              makeSummaryTable();
            }
          }).fail(function(err) {
            alert("Lỗi kết nối: " + err.responseText);
          });
        });
      $actionTd.append($btn);
    } else if (isManual) {
      $actionTd.append($("<span>").addClass("manual-badge").text("✏️ Đã sửa"));
    }
    $(this).append($actionTd);
  });
}

$(document).ready(function() {
  const $adminBtn = $("<button>")
    .text(isAdminMode() ? "🔓 Admin ON" : "🔒 Admin")
    .attr("id", "admin_toggle_btn")
    .css({ fontSize: "10px", padding: "4px 10px", minWidth: "auto" })
    .on("click", toggleAdminMode);
  $("header").append($adminBtn);
});

/* ───────────────────────────────────────────
   2. FILTER Term + KPI BAR + Loading + Enter-to-next
─────────────────────────────────────────── */
function applyTermFilter() {
  const start = $("#start-term").val();
  const end = $("#end-term").val();
  const prodFilter = ($("#production_type_filter").val() || "").trim().toLowerCase();
  if (!start && !end && !prodFilter) {
    _origFillTableBody(_summaryRawData, $("#summary__table tbody"));
    _decorateSummaryRows(_summaryRawData, $("#summary__table tbody"));
    return;
  }
  const filtered = _summaryRawData.filter(function(row) {
    let ok = true;
    if (start && row.production_date < start) ok = false;
    if (end && row.production_date > end) ok = false;
    if (prodFilter && !(row.production_number || "").toLowerCase().includes(prodFilter)) ok = false;
    return ok;
  });
  _origFillTableBody(filtered, $("#summary__table tbody"));
  _decorateSummaryRows(filtered, $("#summary__table tbody"));
}
$(document).on("change", "#start-term, #end-term", applyTermFilter);
$(document).on("keyup", "#production_type_filter", applyTermFilter);

function updateKPIBar(data) {
  if (!$("#kpi_bar").length) {
    $("<div id='kpi_bar'></div>").insertBefore(".main__wrapper");
  }
  const today = new Date().toISOString().slice(0, 10);
  const thisMonth = today.slice(0, 7);

  let todayQty = 0, monthOk = 0, monthNg = 0;
  data.forEach(function(row) {
    const qty = Number(row.total_qty) || 0;
    const ok = Number(row.total_ok) || 0;
    const ng = Number(row.total_ng) || 0;
    if (row.production_date === today) todayQty += qty;
    if ((row.production_date || "").slice(0, 7) === thisMonth) {
      monthOk += ok; monthNg += ng;
    }
  });
  const monthTotal = monthOk + monthNg;
  const ngPct = monthTotal > 0 ? ((monthNg / monthTotal) * 100).toFixed(1) : "0.0";

  $("#kpi_bar").html(`
    <div class="kpi-chip"><span class="kpi-label">📦 Tổng SL hôm nay</span><span class="kpi-val">${todayQty.toLocaleString()}</span></div>
    <div class="kpi-chip ${ngPct > 3 ? 'kpi-warn' : 'kpi-ok'}"><span class="kpi-label">⚠ %NG tháng này</span><span class="kpi-val">${ngPct}%</span></div>
    <div class="kpi-chip"><span class="kpi-label">✅ OK tháng này</span><span class="kpi-val">${monthOk.toLocaleString()}</span></div>
    <div class="kpi-chip"><span class="kpi-label">❌ NG tháng này</span><span class="kpi-val">${monthNg.toLocaleString()}</span></div>
  `);
}

if (!$("#loading_overlay").length) {
  $("body").prepend(`
    <div id="loading_overlay" style="display:none;position:fixed;inset:0;background:rgba(15,43,74,.15);z-index:999;align-items:center;justify-content:center;">
      <div style="background:#fff;padding:16px 24px;border-radius:10px;box-shadow:0 4px 16px rgba(15,43,74,.2);font-size:13px;font-weight:600;color:#0f2b4a;">
        ⏳ Đang xử lý...
      </div>
    </div>
  `);
}
const _origMyAjaxFn = myAjax.myAjax;
myAjax.myAjax = function(fileName, sendData) {
  $("#loading_overlay").show();
  try {
    _origMyAjaxFn(fileName, sendData);
  } finally {
    $("#loading_overlay").hide();
  }
};

const TAB_ORDER = [
  "production_date","production_time_start","production_time_end","staff",
  "production_number","die_number","die_status_note","plug_number","plug_status_note",
  "buloong_a1","buloong_a2","buloong_b1","buloong_b2",
  "buloong_c1","buloong_c2","buloong_d1","buloong_d2",
  "conveyor_height","conveyor_height_note","compress_dim","compress_dim_note",
  "compress_pressure","compress_pressure_note","clamp_pressure","clamp_pressure_note",
  "start_pull_speed","main_pull_speed","end_pull_speed","pusher_speed",
  "angle","roller_dis","roller_speed","puller_force"
];
$(document).on("keydown", "input", function(e) {
  if (e.key !== "Enter") return;
  e.preventDefault();
  const curId = $(this).attr("id");
  const idx = TAB_ORDER.indexOf(curId);
  if (idx >= 0 && idx < TAB_ORDER.length - 1) {
    const nextId = TAB_ORDER[idx + 1];
    $("#" + nextId).focus().select();
  }
});

/* ───────────────────────────────────────────
   3. BẢNG CHỌN LÔ ÉP TỰ ĐỘNG THEO MÃ SP
─────────────────────────────────────────── */
function loadPressOptions() {
  const productionNumberId = $("#production_number_id").val();
  if (!productionNumberId || productionNumberId == 0) {
    $("#press_options_table tbody").empty();
    return;
  }
  $.ajax({
    type: "POST",
    url: "./php/SelPressOptions.php",
    dataType: "json",
    data: { production_number_id: productionNumberId },
    async: false
  }).done(function(data) {
    renderPressOptions(data);
  }).fail(function(err) {
    console.error("Lỗi load lô ép:", err.responseText);
  });
}

function renderPressOptions(data) {
  const $tbody = $("#press_options_table tbody");
  $tbody.empty();
  if (!data || data.error) {
    $tbody.append("<tr><td colspan='3' style='color:#dc2626'>Lỗi: " + (data && data.error ? data.error : "không xác định") + "</td></tr>");
    return;
  }
  if (data.length === 0) {
    $tbody.append("<tr><td colspan='3' style='color:#9aa3b0'>Không có lô ép nào cho mã SP này</td></tr>");
    return;
  }
  data.forEach(function(row) {
    const availQty = Number(row.available_qty) || 0;
    const rowClass = availQty <= 0 ? "row-out-of-stock" : "";
    const $tr = $("<tr>")
      .addClass(rowClass)
      .attr("data-press-id", row.press_id)
      .attr("data-press-date", row.press_date_at)
      .attr("data-die-number", row.die_number || "");
    $tr.append($("<td>").text(row.press_date_at || "-"));
    $tr.append($("<td>").addClass(availQty > 0 ? "qty-ok" : "qty-empty").text(availQty));
    $tr.append($("<td>").text(row.total_rack || 0));
    $tbody.append($tr);
  });
}

$(document).on("click", "#press_options_table tbody tr", function() {
  if ($(this).hasClass("row-out-of-stock")) {
    alert("Lô ép này đã hết rack khả dụng, vui lòng chọn lô khác.");
    return;
  }
  $("#press_options_table tbody tr").removeClass("selected-record");
  $(this).addClass("selected-record");

  const pressId = $(this).data("press-id");
  const pressDate = $(this).data("press-date");
  const dieNumber = $(this).data("die-number");

  $("#press_date").val(pressDate);

  // FIX: #press_id là <select>, .val() chỉ hoạt động nếu có <option>
  // khớp giá trị đó trước. Tự thêm option (giống cách SelDies gốc làm).
  if ($("#press_id").length) {
    $("#press_id option").remove();
    $("#press_id").append($("<option>").val(pressId).html(dieNumber));
    $("#press_id").val(pressId);
  }
  makePressTable();
});

$(document).on("change", "#production_number_id", function() {
  loadPressOptions();
});

$(document).ready(function() {
  $("#press_date").closest("tr").hide();
});

/* ───────────────────────────────────────────
   FIX: gọi lại makeSummaryTable() sau khi mọi patch
   đã nạp xong, để KPI bar hiện ngay từ lần tải đầu.
   (Lần gọi gốc ở đầu file chạy TRƯỚC khi fillTableBody
   bị hook ở đây, nên không kích hoạt updateKPIBar được)
─────────────────────────────────────────── */
makeSummaryTable();

/* ════════════════════════════════════════════════════════════
   ═══ PATCH v6 — AUTOCOMPLETE DROPDOWN ═══
   Thay thế việc phải mở <select> ẩn bằng dropdown gợi ý nổi,
   click chọn trực tiếp. KHÔNG sửa SelProductionNumber/SelDies/
   SelPlugs/selStaffDrawing gốc — chỉ "nghe" ajaxReturnData sau
   khi các hàm đó chạy, rồi render dropdown từ chính data đó.
════════════════════════════════════════════════════════════ */

const AUTOCOMPLETE_CONFIG = [
  { inputId: "production_number", selectId: "production_number_id", triggerFn: function(){ SelProductionNumber(); } },
  { inputId: "die_number",         selectId: "die_number_id",         triggerFn: function(){ SelDies(); } },
  { inputId: "plug_number",        selectId: "plug_number_id",        triggerFn: function(){ SelPlugs(); } },
  { inputId: "staff",              selectId: "staff_id",              triggerFn: function(){ selStaffDrawing(); } },
  { inputId: "staff_cut",          selectId: "cutting_staff_id",      triggerFn: function(){ selStaffCutting(); } }
];

function _buildAutocompleteDropdown(cfg) {
  const $input = $("#" + cfg.inputId);
  if (!$input.length) return;

  // Tạo wrapper relative để dropdown nổi đúng vị trí
  if (!$input.parent().hasClass("ac-wrapper")) {
    $input.wrap("<div class='ac-wrapper'></div>");
  }
  if ($("#ac-list-" + cfg.inputId).length === 0) {
    $("<div>").attr("id", "ac-list-" + cfg.inputId).addClass("ac-dropdown").insertAfter($input);
  }
}

function _renderAutocompleteList(cfg) {
  const $select = $("#" + cfg.selectId);
  const $list = $("#ac-list-" + cfg.inputId);
  $list.empty();

  const options = $select.find("option").filter(function() {
    return $(this).val() != 0; // bỏ option "NO"
  });

  if (options.length === 0) {
    $list.hide();
    return;
  }

  options.each(function() {
    const val = $(this).val();
    const text = $(this).text();
    $("<div>").addClass("ac-item").text(text).attr("data-val", val).appendTo($list);
  });
  $list.show();
}

$(document).on("click", ".ac-item", function() {
  const $list = $(this).parent();
  const inputId = $list.attr("id").replace("ac-list-", "");
  const cfg = AUTOCOMPLETE_CONFIG.find(function(c) { return c.inputId === inputId; });
  if (!cfg) return;

  const val = $(this).data("val");
  const text = $(this).text();

  $("#" + cfg.inputId).val(text);
  $("#" + cfg.selectId).val(val).trigger("change");
  $list.hide();
});

// Ẩn dropdown khi click ra ngoài
$(document).on("click", function(e) {
  if (!$(e.target).hasClass("ac-item") && !$(e.target).hasClass("ac-input")) {
    $(".ac-dropdown").hide();
  }
});

// Hook vào sau mỗi lần keyup trigger search — render lại list
AUTOCOMPLETE_CONFIG.forEach(function(cfg) {
  _buildAutocompleteDropdown(cfg);
  $(document).on("keyup", "#" + cfg.inputId, function() {
    setTimeout(function() { _renderAutocompleteList(cfg); }, 50); // đợi AJAX sync xong
  });
  $("#" + cfg.inputId).addClass("ac-input").attr("autocomplete", "off");
});

/* ════════════════════════════════════════════════════════════
   ═══ PATCH v7 — ĐA NGÔN NGỮ VI / EN / JP ═══
   Cơ chế: gắn data-i18n="key" vào <th>/<label> trong HTML,
   JS đổi text theo ngôn ngữ chọn. Lưu lựa chọn vào localStorage.
   KHÔNG đổi placeholder/value của input — chỉ đổi label hiển thị.
════════════════════════════════════════════════════════════ */

const I18N_DICT = {
  ngay_sx:       { vi: "Ngày SX",        en: "Prod. Date",     jp: "生産日" },
  gio_sx:        { vi: "Giờ SX",         en: "Time",           jp: "時間" },
  nhan_vien:     { vi: "Nhân viên",      en: "Staff",          jp: "担当者" },
  ma_ct:         { vi: "Mã CT",          en: "Order No.",      jp: "注文番号" },
  ma_sp:         { vi: "Mã SP",          en: "Product Code",   jp: "品番" },
  ma_khuon:      { vi: "Mã Khuôn",       en: "Die No.",        jp: "ダイス番号" },
  tt_khuon:      { vi: "TT Khuôn",       en: "Die Status",     jp: "ダイス状態" },
  ma_plug:       { vi: "Mã Plug",        en: "Plug No.",       jp: "プラグ番号" },
  tt_plug:       { vi: "TT Plug",        en: "Plug Status",    jp: "プラグ状態" },
  ngay_dun:      { vi: "Ngày đùn",       en: "Press Date",     jp: "押出日" },
  chon_lo_ep:    { vi: "📋 Chọn lô ép (tự động theo Mã SP)", en: "📋 Select Press Lot (auto by Product Code)", jp: "📋 プレスロット選択（品番自動）" },
  khuon:         { vi: "Khuôn",          en: "Die",            jp: "ダイス" },
  dieu_chinh_khuon: { vi: "Điều chỉnh khuôn", en: "Die Adjustment", jp: "ダイス調整" },
  bop_ong:       { vi: "Bóp ống",        en: "Tube Squeeze",   jp: "管絞り" },
  toc_do_keo:    { vi: "Tốc độ kéo",     en: "Pull Speed",     jp: "引抜速度" },
  chinh_thang:   { vi: "Chỉnh thẳng",    en: "Straightening",  jp: "矯正" },
  ngay_cat:      { vi: "Ngày cắt",       en: "Cut Date",       jp: "切断日" },
  nv_cat:        { vi: "NV cắt",         en: "Cut Staff",      jp: "切断担当" },
  save:          { vi: "Lưu",            en: "Save",           jp: "保存" },
  update:        { vi: "Cập nhật",       en: "Update",         jp: "更新" },
  admin:         { vi: "🔒 Admin",       en: "🔒 Admin",        jp: "🔒 管理者" },
  th_ngay_sx:    { vi: "Ngày SX",        en: "Date",           jp: "生産日" },
  th_ma_sp:      { vi: "Mã SP",          en: "Product",        jp: "品番" },
  th_nv_bc:      { vi: "NV báo cáo",     en: "Reported By",    jp: "報告者" },
  th_sua:        { vi: "Sửa",            en: "Edit",           jp: "編集" }
};

const LANG_KEY = "tube_drawing_lang";

function getCurrentLang() {
  return localStorage.getItem(LANG_KEY) || "vi";
}

function applyLanguage(lang) {
  localStorage.setItem(LANG_KEY, lang);
  $("[data-i18n]").each(function() {
    const key = $(this).data("i18n");
    if (I18N_DICT[key] && I18N_DICT[key][lang]) {
      $(this).text(I18N_DICT[key][lang]);
    }
  });
  $(".lang-switch-btn").removeClass("act");
  $(".lang-switch-btn[data-lang='" + lang + "']").addClass("act");
}

$(document).ready(function() {
  // Thêm nút chuyển ngôn ngữ vào header (cạnh nút Admin)
  const $langSwitch = $("<div>").addClass("lang-switch").css({display:"inline-flex", marginLeft:"8px", gap:"2px"});
  ["vi", "en", "jp"].forEach(function(lang) {
    $("<button>")
      .addClass("lang-switch-btn")
      .attr("data-lang", lang)
      .text(lang.toUpperCase())
      .css({fontSize:"9px", padding:"3px 7px", minWidth:"auto"})
      .on("click", function() { applyLanguage(lang); })
      .appendTo($langSwitch);
  });
  $("header").append($langSwitch);

  applyLanguage(getCurrentLang());
});

/* ════════════════════════════════════════════════════════════
   ═══ PATCH v8 — VALIDATE: chỉ cho Update khi CÓ thay đổi thật ═══
   checkUpdate() gốc chỉ check "đã điền đủ", không check "có sửa gì không".
   Patch này thêm điều kiện: phải có ít nhất 1 field khác giá trị
   lúc vừa chọn record (snapshot lúc selected-record được click).
════════════════════════════════════════════════════════════ */

let _recordSnapshot = null;

function _takeSnapshot() {
  const snap = {};
  $(".left__wrapper .save-data").each(function() {
    const id = $(this).attr("id");
    if (id) snap[id] = $(this).val();
  });
  return snap;
}

function _hasChangedFromSnapshot() {
  if (!_recordSnapshot) return false;
  let changed = false;
  $(".left__wrapper .save-data").each(function() {
    const id = $(this).attr("id");
    if (id && _recordSnapshot[id] !== undefined && _recordSnapshot[id] !== $(this).val()) {
      changed = true;
    }
  });
  return changed;
}

// Khi 1 dòng summary được click chọn (selected-record) → lưu snapshot
$(document).on("click", "#summary__table tbody tr", function() {
  setTimeout(function() {
    _recordSnapshot = _takeSnapshot();
  }, 300); // đợi putDataToInput() điền xong field
});

// Hook thêm điều kiện vào checkUpdate gốc — không sửa hàm gốc, chỉ thêm guard sau khi nó chạy
const _origCheckUpdate = checkUpdate;
checkUpdate = function() {
  const baseCheck = _origCheckUpdate();
  if (baseCheck && !_hasChangedFromSnapshot()) {
    $("#update__button").attr("disabled", true);
    return false;
  }
  return baseCheck;
};

// Re-check mỗi khi người dùng gõ vào field bất kỳ trong left__wrapper
$(document).on("input change", ".left__wrapper .save-data", function() {
  checkUpdate();
});
