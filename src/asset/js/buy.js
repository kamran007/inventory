$(document).ready(()=>{
    //Reset cost form by reset button click
    $('#costReset').on('click',()=>{
        $('#costDescription').val('');
        $('#amount').val('');
    })
    // add new row from into table by add button click
    $('#costAdd').on('click',(event)=>{
        let costDescription = $('#costDescription').val();
        let amount = $('#amount').val();
        let newRow = `<tr><td scope="col">${costDescription}</td><td scope="col">${amount}</td><td scope="col"><a class="mx-2 btn btn-outline-danger" onClick="onDelete(this)"><i class="bi bi-x-square-fill"></i></a></td></tr>`;
        $('tbody').append(newRow);
        $('#costDescription').val('');
        $('#amount').val('');
        let table=document.getElementById('CostTable').getElementsByTagName('tbody')[0]
        let len = table.rows.length;
        let c=[]
        let a =[]
        for(let i=0;i<len;i++){
            c[i]= table.rows[i].cells[0].innerHTML;
            a[i] = table.rows[i].cells[1].innerHTML
        }
        $('#c_d').val(c);
        $('#c_a').val(a);
    })
    $('#resetImport').on('click',()=>{
        $('#exporter').val('').change();
        $('#product').val('').change();
        $('#quantity').val('');
        $('#totalPrice').val('');
        $('#costDescription').val('');
        $('#amount').val('');
        $('tbody').html('');
        $('input[type="date"]').val(new Date().toISOString().split('T')[0])
    })
    let today = new Date().toISOString().split('T')[0]
    $('input[type="date"]').val(today);
})
const onDelete = (td) =>{
    selectedRow = td.parentElement.parentElement.remove();
}