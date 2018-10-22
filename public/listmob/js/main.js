
var db;

var editedId;
var editedType;
var editedName;

$(document).ready(function(){

// db handler
    var openReq = indexedDB.open("listmob", 1);
    openReq.onupgradeneeded = function(e){
        var db = e.target.result;
        if(!db.objectStoreNames.contains("tasks")){
            var stores = db.createObjectStore("tasks", {
                keyPath: "id", 
                autoIncrement: true
            });
            stores.createIndex("data", "data", {unique:false});
        }
    }

    openReq.onsuccess = function(e){
        db = e.target.result;
        console.log('success');
    }

    openReq.onerror = function(e){
        console.log(e.target.error.name); 
    }


    $('#settings form').submit(saveSettings);

    $('#addNew form').submit(addEntries);
    //$('#settings').bind('pagebeforeshow', loadSettings);
    var theme = getTheme(localStorage.currentTheme);
    $('section[data-role="page"]').attr("data-theme", theme );

    $('#home li').bind('click', function(e){
        console.log(e.target.text);
        console.log(e.target);
        editedType = getTaskType(e.target.text);
        refreshList(e.target.text);
    })


    $('#editTask form').submit(function(e){
        console.log(e);
        var tn = db.transaction(['tasks'], 'readwrite');
        var store = tn.objectStore('tasks');
        req = store.get(editedId);
        
        req.onsuccess  =function(e){
            var data = req.result;
            data.taskName = $('#editedTask').val();
            var reqUpdate = store.put(data);
        }

        //history.back();
        window.location.replace("index.html");
        //$('#list-items').listview('refresh');
        //location.reload()
        return false;


    });
    
});

function saveSettings(){
    var currentTheme  = $("#themeType").val();

    console.log('saving form' + currentTheme);
        localStorage.currentTheme=currentTheme;
        history.back();
        location.reload()
        return false;
}

function loadSettings(){
    if(!localStorage.currentTheme){   
        localStorage.currentTheme="1";  
    }else{
        $("#themeType").val(localStorage.currentTheme).select("refresh");
    }
}

function getTheme(num){
    var res = ""
    if(num === "1"){
        res = "a";
    }
    if(num==="2"){
        res="b";
    }
    return res;
}

function addEntries(){
    var task = {
        taskName:$('#newTask').val(),
        taskType:$('#taskType').val()
    }

    var tn = db.transaction(['tasks'], 'readwrite');
    var store = tn.objectStore('tasks');
    var req = store.add(task);
    //history.back();
    window.location.replace("index.html");
    taskName:$('#newTask').val()  ='';
    taskType:$('#taskType').val() = '';

    return false;
}

function getTaskType(taskName){
    var taskType = "";
    if(taskName === "Zakupy"){
        taskType = "1";
    }else if(taskName === "Praca"){
        taskType = "2";
    }else if(taskName ==="Osobiste"){
        taskType = "3";
    }else if(taskName ==="Wszystkie"){
        taskType = "4";
    }
    return taskType;
}

function getTaskName(taskType){
    var taskName = '';
    if(taskType === "1"){
        taskName = "Zakupy";
    }
    if(taskType === "2"){
        taskName = "Praca";
    }
    if(taskType === "3"){
        taskName = "Osobiste";
    }
    if(taskType === "4"){
        taskName = "Wszystkie";
    }
    return taskName;
}

function refreshList(taskName){
    var taskType = getTaskType(taskName);
    currentTaskType = taskType;
    var tn = db.transaction(['tasks'], 'readonly');
    var store = tn.objectStore('tasks');
    var index = store.index("data");
    // var range = IDBKeyRange.lowerBound(taskType);
    var req = store.openCursor();

    //usuwamy elementy wieksze niz 0
    $('#list-items ul li:gt(0)').remove();

    req.onsuccess = function(e){
        var cur = e.target.result;
        //console.log(cur);
        if(cur){
           
            var newRow = $('#entry-template').clone();
            newRow.removeAttr("id");
            newRow.removeAttr("style");

            if(cur.value['taskType'] === taskType || taskType === "4"){
                console.log(taskType);
                var curTaskType = getTaskName(cur.value['taskType']);
                newRow.data("rowId", cur.value['id']);
                newRow.appendTo('#list-items ul');
                newRow.find('.label').text(toTitleCase(cur.value['taskName']));
                newRow.find('.itemType').text('(' + toTitleCase(curTaskType) + ')');

                //obsluga usuwania
                newRow.find('.delete').click(function(e){
                    var clickedItem = $(this).parent();
                    var clickedId = clickedItem.data('rowId');
                    deleteById(clickedId);
                    clickedItem.slideUp();
                })

                newRow.find('.edit').click(function(e){
                    var clickedItem = $(this).parent();
                    var clickedId = clickedItem.data('rowId');
                    editedName  = clickedItem[0].children[0].innerText;
                    editById(clickedId, clickedItem);
                })

            }
            

            
            cur.continue();
        }
    }

}

function deleteById(id){
    var tn = db.transaction(['tasks'], 'readwrite');
    var store = tn.objectStore('tasks');
    var req = store.delete(id);
    req.onsuccess = function(e){
        console.log('rekord usuniety', id);
    }

    req.onerror = function(e){
        console.log('error', e.target.error.name);
    }
}

function editById(id, item){
    console.log('editing ' + id + ' of ' + editedType);
    $.mobile.navigate('#editTask');
    $('#editedTask').val(editedName);
    editedId = id;
}

function toTitleCase(str) {
    return str.replace(/(?:^|\s)\w/g, function(match) {
        return match.toUpperCase();
    });
}