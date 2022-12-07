import React from 'react';

const AddressPanel = props => {
    const { type, isChecked, register } = props;

    return (
        <>
            <div className="box">
                <div className="field">
                    <input type="text" {...register(`${type}Name`)} required={!isChecked} />
                    <label htmlFor="">Full Name</label>
                </div>
                <div className="field">
                    <input type="text" {...register(`${type}Phone`)} required={!isChecked} />
                    <label htmlFor="">Phone number</label>
                </div>

            </div>
            <div className="box">
                <div className="field">
                    <input type="email" {...register(`${type}Email`)} required={!isChecked} />
                    <label htmlFor="">Email</label>
                </div>
                <div className="field">
                    <input type="text" {...register(`${type}Country`)} required={!isChecked} />
                    <label htmlFor="">Country</label>
                </div>
            </div>
            <div className="box">
                <div className="field">
                    <input type="text" {...register(`${type}City`)} required={!isChecked} />
                    <label htmlFor="">City</label>
                </div>
                <div className="field">
                    <input type="text" {...register(`${type}ZipCode`)} required={!isChecked} />
                    <label htmlFor="">Zip Code</label>
                </div>
            </div>
            <div className="box">
                <div className="field">
                    <input type="text" {...register(`${type}Street`)} required={!isChecked} />
                    <label htmlFor="">Street</label>
                </div>
            </div>
        </>
    )
}

export default AddressPanel;