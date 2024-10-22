import React, { useState } from 'react';

function IdleClicker() {
    const [count, setCount] = useState(0); // Initialize count state

    return (
        <div className="card2">
            <h4 className='card2-text'>Stress Relief
            <br></br>Idle Clicker</h4>
            <button className='idle' onClick={() => setCount(count + 1)}>
                Count is {count}
            </button>          
        </div>
    );
}

export default IdleClicker;
