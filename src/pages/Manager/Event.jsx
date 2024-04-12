import React, { useState } from 'react';
import axios from 'axios';

function CreateEventButton() {
    async function handleCreateMeeting() {
        try {
            const res = await axios.get('https://meet.google.com/new');
            console.log(res.data); // виводимо результат у консоль
        } catch (error) {
            console.error('Помилка при отриманні лінку на відеоконференцію:', error);
        }
    }

    return (
        <div>
            <button onClick={handleCreateMeeting}>
                Створити відеоконференцію
            </button>
        </div>
    );
};

export default CreateEventButton;
