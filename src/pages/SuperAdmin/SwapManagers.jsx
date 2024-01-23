import React, { useState } from 'react';
import { swapAppointmentManagers } from '../../helpers/appointment/appointment';
import { info, success, error } from "@pnotify/core";

const SwapManagersComponent = () => {
  const [link1, setLink1] = useState('');
  const [link2, setLink2] = useState('');

  const handleSwapManagers = () => {
    const data = new FormData();
    data.append("appointment_id_1", link1);
    data.append("appointment_id_2", link2);

    swapAppointmentManagers(data)
      .then(() => {
        success("Swapped successfully");
      })
      .catch((error) => {
        console.error(error);
        // Handle errors here, for example, show an error notification.
        error("An error occurred while swapping managers");
      });
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
