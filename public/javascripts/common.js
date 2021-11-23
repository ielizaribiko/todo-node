flatpickr(".js-input-datetime",{
    enableTime: true,
    dateFormat: "d/m/Y H:i",
});

function showModal(id){
    var modals = document.getElementsByClassName('js-modal-'+id);
    if(modals.length){
        modals[0].style.display = 'block';
    }
}

function hideModal() {
    var modals = document.querySelectorAll('[class*="js-modal-"]');
    modals.forEach(item => item.style.display = 'none');
}