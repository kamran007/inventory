$(document).ready(()=>{
    //Reset cost form by reset button click
    $('#costReset').on('click',()=>{
        $('#costDescription').val('');
        $('#amount').val('');
    })
    // add new row from into table by add button click
    let selectedRow = null;
    $('#costAdd').on('click',(event)=>{
        let costDescription = $('#costDescription').val();
        let amount = $('#amount').val();
        let table
        if(selectedRow == null){
            let newRow = `<tr><td>${costDescription}</td><td>${amount}</td><td><a class="mx-2 btn btn-outline-warning" onClick="onEdit(this)"><i class="bi bi-pencil-fill"></i></a>
            <a class="mx-2 btn btn-outline-danger" onClick="onDelete(this)"><i class="bi bi-x-square-fill"></i></a></td></tr>`;
            $('tbody').append(newRow);
            $('#costDescription').val('');
            $('#amount').val('');
        }else{
            selectedRow.cells[0].innerHTML= costDescription;
            selectedRow.cells[1].innerHTML = amount;
            $('#costAdd').html('Add')
            selectedRow = null;
        }
        
    })
})
const onDelete = (td) =>{
    console.log('on delete');
    selectedRow = td.parentElement.parentElement.remove();
}
const onEdit= (td)=>{
    selectedRow = td.parentElement.parentElement
    let costDescription = selectedRow.cells[0].innerHTML;
    let amount = selectedRow.cells[1].innerHTML;

    $('#costDescription').val(costDescription.trim());
    $('#amount').val(amount.trim());
    $('#costAdd').html('Update')
}

