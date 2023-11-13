const saveFormData = formName => {
    const frm = document.querySelector(`form[name=${formName}]`);
    if(!frm) {
        return `[${formName}]을 찾을 수 없습니다`;
    }
    const frmData = new FormData(frm);
    const serialized = JSON.stringify(Array.from(frmData.entries()));
    localStorage.setItem('myForm', serialized);

    return '저장되었습니다.';
};

const loadFormData = (formName) => {
    const getType = element => {
        if(element.type)
            return element.type;
        
        if(element.length > 1) {
            for(child of element) {
                if(child.type) return child.type;
            }
        }
        return undefined;
    };

    const loadData = localStorage.getItem(formName);
    if(!loadData) return '등록된 데이터가 없습니다.';

    const frm = document.querySelector(`form[name=${formName}]`);
    const formObj = JSON.parse(loadData);
    formObj.forEach(([key, value]) => {
        const element = frm[key];
        const type = getType(element);

        if(type === 'text' || type === 'radio' || type === 'select' || type === 'select-one') {
            element.value = value;
        } else if(type === 'checkbox') {
            document.querySelector(`input[name=${key}][value=${value}]`).checked = true;
        }
    });
};

const removeFormData = formName => localStorage.removeItem(formName);

const showMessage = msg => document.getElementById('alertMsg').innerHTML = msg;
const resultMessageHandle = ([{result}]='') => showMessage(result);

/** executeScript 이벤트 등록 */
const onClick = (id, callfunc) => {
    document.getElementById(id).addEventListener('click', e => {
        const formName = document.getElementById('formName').value;
        if(!formName) {
            showMessage('폼 이름을 입력하세요');
            return;
        }
    
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {        
            chrome.scripting.executeScript({
              target: {tabId: tabs[0].id},
              func: callfunc,
              args: [formName]
            }, 
            resultMessageHandle
            );
        });
    });
};

onClick('save', saveFormData);
onClick('load', loadFormData);
onClick('remove', removeFormData);