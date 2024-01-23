import React, { useState } from 'react';
import { swapAppointmentManagers } from '../../helpers/appointment/appointment';

const SwapManagersComponent = () => {
  const [link1, setLink1] = useState('');
  const [link2, setLink2] = useState('');

  const handleSwapManagers = async () => {
    try {
      const formData = new FormData();
      formData.append('appointment_id_1', link1);
      formData.append('appointment_id_2', link2);

      const token = localStorage.getItem('booking');

      await swapAppointmentManagers(formData);

      // Оновіть інтерфейс або виконайте додаткові дії після успішного свапу

    } catch (error) {
      console.error(error);
      // Обробка помилок або виведення повідомлення користувачу
    }
  };

  return (
    <form>
      <label>
        Link 1:
        <input type="text" value={link1} onChange={(e) => setLink1(e.target.value)} />
      </label>
      <br />
      <label>
        Link 2:
        <input type="text" value={link2} onChange={(e) => setLink2(e.target.value)} />
      </label>
      <br />
      <button type="button" onClick={handleSwapManagers}>
        Swap Managers
      </button>
    </form>
  );
};

export default SwapManagersComponent;
