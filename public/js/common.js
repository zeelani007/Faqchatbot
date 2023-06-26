$(document).ready(function() {
    $.ajaxSetup({
        headers: {
            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
        },
    });

    $(".select2").select2();
    $('[data-toggle="tooltip"]').tooltip();
    $('[data-toggle="popover"]').popover();
    $("#stakeHoldersTable, #completedMaintenanceTable, #pendingMaintenanceTable").DataTable({
        paging: true,
        lengthChange: false,
        searching: true,
        info: true,
        autoWidth: false,
        pageLength: 50,
        "order": []
    });

    passwordStrengthValidity = false;
    $("#password, #new_password").passwordValidation({}, function(element, valid, match, failedCases) {
        let html = '<span>Password must contain at least:</span><p style="list-style:none;">';
        $.each(failedCases, (indx, node) => {
            html += '<span class="req"><i class="fa fa-caret-right" aria-hidden="true"></i>   ' + node + "</span><br>";
        });
        html += "</p>";
        if (failedCases.length) {
            passwordStrengthValidity = false;
            $("#errors").html(html);
        } else {
            $('[data-toggle="popover"]').popover("hide");
            passwordStrengthValidity = true;
        }
    });
    $.validator.addMethod("passwordStrength", function(value, element) {
            return passwordStrengthValidity;
        },
        "The password isn't strong enough"
    );
});

let ajaxcall = (method, params, url) => {
    $("#loader").css({
        display: "block"
    });
    return new Promise((resolve, reject) => {
        $.ajax({
            type: method,
            data: params,
            url: url,
            processData: false,
            contentType: false,
            success: (resp) => {
                $("#loader").css({
                    display: "none"
                });
                resolve(resp);
            },
            error: (resp) => {
                reject(resp);
            },
        });
    });
};

let fetchCities = (stateSelectBox, districtSelectBox) => {
    let state = stateSelectBox.value;
    ajaxcall("GET", {}, baseUrl + "/ajax/fetchCities/" + state).then((resp) => {
        setDropdownHtml(resp, districtSelectBox);
    });
};

let fetchSubDistricts = (districtSelectBox, subDistrictSelectBox) => {
    let district = districtSelectBox.value;
    ajaxcall("GET", {}, baseUrl + "/ajax/fetchSubDistricts/" + district).then(
        (resp) => {
            setDropdownHtml(resp, subDistrictSelectBox);
        }
    );
};

let setDistrict = (state, districtSelectBox, district) => {
    ajaxcall("GET", {}, baseUrl + "/ajax/fetchCities/" + state).then((resp) => {
        setDropdownHtml(resp, districtSelectBox);
        $("#" + districtSelectBox).val(district);
    });
};

let setSubDistrict = (district, subDistrictSelectBox, subDistrict) => {
    ajaxcall("GET", {}, baseUrl + "/ajax/fetchSubDistricts/" + district).then(
        (resp) => {
            setDropdownHtml(resp, subDistrictSelectBox);
            $("#" + subDistrictSelectBox).val(subDistrict);
        }
    );
};

let allotInspector = (link, url) => {
    $("#systemInspectorModal #systemInspectorForm").attr("action", url);
    $("#systemInspectorModal").modal("show");
};

let setDropdownHtml = (dataArray, selectBox) => {
    let html = "<option disabled selected>Select</option>";
    $.each(dataArray, (index, node) => {
        html += '<option value="' + node.code + '">' + node.name + "</option>";
    });
    $("#" + selectBox).html(html);
};

let uploadExcel = (form, url, user = null) => {
    $("#uploadSubmitButton").html("Sending...");
    var formData = new FormData(form);
    formData.append("user", user);
    $.ajax({
        type: "POST",
        url: url,
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
            $("#uploadSubmitButton").html("Submit");
            $("#uploadExcelForm").trigger("reset");
            if (response.status === "success") {
                $("#uploadExcelModal .modal-body").prepend(
                    '<p class="text-success">' + response.message + "</p>"
                );
            }
        },
        error: function(exception) {
            $("#uploadSubmitButton").html("Submit");
            if (exception.errors) {
                console.log(exception.errors);
            }
        },
    });
};

$(".sNc").click(function() {
    validator = $("#" + $(this).data("form")).validate();
    if ($("#" + $(this).data("form")).valid()) {
        saveNContinue($(this));
    }
});

let saveNContinue = (tabButton) => {
    let form = new FormData($("#" + tabButton.data("form"))[0]);
    ajaxcall("POST", form, baseUrl + "/ajax/addEditSystem").then((resp) => {
        $("#" + tabButton.data("tabination") + " li a[href$=" + tabButton.data("next") + "]").tab("show");
        $("html, body").animate({
            scrollTop: 0
        }, 100);
    });
};

let changeConsumerApproval = (button, url) => {
    $("#consumerApprovalModal .modal-body #action").html($(button).data("approve"));
    $("#consumerApprovalModal #approvalLink").attr("href", url);
    $("#consumerApprovalModal").modal("show");
};

let consumerInstallerAssociation = (link, url) => {
    $("#consumerInstallerModal #consumerInstallerForm").attr("action", url);
    $("#consumerInstallerModal").modal("show");
    $('#consumerInstallerForm').validate();
};

let associateUser = (url, user) => {
    $("#usersAssociationModal #user").html(user);
    $("#usersAssociationModal #associatedLink").attr("href", url);
    $("#usersAssociationModal").modal("show");
};

let blackListUser = (link, url) => {
    $("#usersBlacklistModal .modal-body #action").html($(link).data("text"));
    $("#usersBlacklistModal #blacklistLink").attr("href", url);
    $("#usersBlacklistModal").modal("show");
};

let getSubDistrictByVillage = (villageSelectBox, subDistrictSelectBox) => {
    let village = villageSelectBox.value;
    ajaxcall("GET", {}, baseUrl + "/ajax/fetchSubDistrictsByVillage/" + village).then((resp) => {
        setDropdownHtml(resp, subDistrictSelectBox);
    });
};

let getDistrictBySubDiscrict = (subDistrictSelectBox, districtSelectBox) => {
    let subdistrict = subDistrictSelectBox.value;
    ajaxcall("GET", {}, baseUrl + "/ajax/fetchDistrictBySubDiscrict/" + subdistrict).then((resp) => {
        setDropdownHtml(resp, districtSelectBox);
    });
};

let getStateByDiscrict = (districtSelectBox, stateSelectBox) => {
    let district = districtSelectBox.value;
    ajaxcall("GET", {}, baseUrl + "/ajax/fetchStateByDiscrict/" + district).then((resp) => {
        setDropdownHtml(resp, stateSelectBox);
    });
};

let makeid = (length) => {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

let isNumber = (evt) => {
    evt = evt ? evt : window.event;
    var charCode = evt.which ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
};

let startTime = () => {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    var d = today.getDate();
    var M = today.getMonth() + 1;
    var y = today.getFullYear();
    document.getElementById("datetime").innerHTML = checkTime(d) + "-" + checkTime(M) + "-" + y + "   " + checkTime(h) + ":" + checkTime(m) + ":" + checkTime(s);
    var t = setTimeout(startTime, 500);
}

let checkTime = (i) => {
    if (i < 10) {
        i = "0" + i;
    } // add zero in front of numbers < 10
    return i;
}

let activateLoader = () => {
    $("#loader").css({
        display: "block"
    });
}