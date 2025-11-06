import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/ProfileEdit.css";

function ProfileEdit() {
  const navigate = useNavigate();

  const [nickname, setNickname] = useState("뷰티러버");
  const [email] = useState("beauty@coco.com");
  const [skinType, setSkinType] = useState("");
  const [skinTone, setSkinTone] = useState("");
  const [concerns, setConcerns] = useState([]);

  // 체크박스 다중 선택 핸들러
  const handleConcernChange = (e) => {
    const value = e.target.value;
    if (concerns.includes(value)) {
      setConcerns(concerns.filter((item) => item !== value));
    } else {
      setConcerns([...concerns, value]);
    }
  };

   const handleSave = () => {
    navigate("/mypage");
  };

  return (
    <div className="profile-edit-container">
      {/* 뒤로가기 */}
      <button className="back-btn" onClick={() => navigate("/mypage")}>
        ← 마이페이지로 돌아가기
      </button>

      <h2 className="page-title">프로필 설정</h2>

      {/* 계정 정보 */}
      <div className="section">
        <h3>계정 정보</h3>
        <label>닉네임</label>
        <div className="input-row">
          <input
            type="text"
            className="input"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <button className="edit-btn">🖉 수정</button>
        </div>

        <label>이메일 (ID)</label>
        <input type="email" className="input readonly" value={email} readOnly />
      </div>

      {/* 피부 프로필 */}
      
        <h3>피부 프로필</h3>
        <p className="section-desc">
          이 정보는 <b>‘Filter by My Profile’</b> 기능과 Co-mate 추천에 사용됩니다.
        </p>
      

      {/* 피부 타입 */}
      <div className="section">
        <label>피부 타입</label>
        <div className="option-grid">
          {["지성", "건성", "복합성", "민감성"].map((type) => (
            <label key={type}>
              <input
                type="radio"
                name="skinType"
                value={type}
                checked={skinType === type}
                onChange={(e) => setSkinType(e.target.value)}
              />
              {type}
            </label>
          ))}
        </div>
      </div>

      {/* 피부 톤 */}
      <div className="section">
        <label>피부 톤</label>
        <div className="option-grid">
          {["쿨톤", "웜톤", "중성"].map((tone) => (
            <label key={tone}>
              <input
                type="radio"
                name="skinTone"
                value={tone}
                checked={skinTone === tone}
                onChange={(e) => setSkinTone(e.target.value)}
              />
              {tone}
            </label>
          ))}
        </div>
      </div>

      {/* 피부 고민 */}
      <div className="section">
        <label>피부 고민 (복수 선택 가능)</label>
        <div className="option-grid checkbox">
          {[
            "모공","여드름","홍조","주름","건조함","민감함","다크스팟","칙칙함",
          ].map((item) => (
            <label key={item}>
              <input
                type="checkbox"
                value={item}
                checked={concerns.includes(item)}
                onChange={handleConcernChange}
              />
              {item}
            </label>
          ))}
        </div>
      </div>

      {/* 퍼스널 컬러 */}
      <div className="section">
        <label>퍼스널 컬러</label>
        <select className="select">
          <option value="" disabled>선택하세요</option>
          <option>여름 쿨톤 (Summer Cool)</option>
          <option>봄 웜톤 (Spring Warm)</option>
          <option>가을 웜톤 (Autumn Warm)</option>
          <option>겨울 쿨톤 (Winter Cool)</option>
        </select>
      </div>

      {/* 저장 버튼 */}
      <button className="save-btn" onClick={handleSave}>변경사항 저장</button>
    </div>
  );
}

export default ProfileEdit;
