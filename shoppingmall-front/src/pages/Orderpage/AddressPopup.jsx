import React, { useEffect } from 'react';
import '../../css/AddressPopup.css'; 

function AddressPopup({ onClose, onSelect }) {

  // 3. 팝업이 열렸을 때  API를 실행합니다.
  useEffect(() => {
    if (window.daum && window.daum.Postcode) {
      
      // 2. 존재할 때만 API를 실행합니다.
      new window.daum.Postcode({
        oncomplete: function(data) {
          onSelect(data.zonecode, data.address);
          onClose();
        }
      }).embed(document.getElementById('postcode-container'));

    } else {
      // 3. 만약 API 스크립트가 로드되지 않았다면, 콘솔에 에러를 기록합니다.
      console.error("Daum Postcode API script not loaded.");
    }

  }, []); // [] : 처음 한 번만 실행

  return (
    // 배경을 클릭해도 닫히도록 onClose를 연결합니다.
    <div className="popup-overlay" onClick={onClose}>
      {/* 하얀 박스를 클릭해도 팝업이 닫히지 않도록 막아줍니다. */}
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        
        <div className="popup-header">
          <h3>우편번호 검색</h3>
          {/* X 버튼을 클릭하면 닫히도록 onClose를 연결합니다. */}
          <button onClick={onClose} className="btn-close">&times;</button>
        </div>

        {/* --- 7. 팝업 본문 --- */}
        {/* Daum API가 이 div 안에 자동으로 검색창을 그려줍니다. */}
        <div className="popup-body">
          <div id="postcode-container" style={{ width: '100%', height: '400px' }}>
            {/* 여기에 Daum API가 자동으로 검색창을 그려줍니다. */}
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default AddressPopup;