export const Input = props => {
    const { name, type, register, errors, placeholder, validationSchema, ...rest } = props;
    
    return (
        <div className='custom-form-control'>
            <input type={type} name={name} placeholder={placeholder} {...register(name, validationSchema)} />
            { errors[name] && <p className='form_error'>{errors[name]?.message}</p> }
        </div>
    )
}

export const TextArea = props => {
    const { name, rows, type, register, errors, placeholder, validationSchema } = props;
    
    return (
        <div className='custom-form-control'>
            <textarea type={type} rows={rows} name={name} placeholder={placeholder} {...register(name, validationSchema)} />
            { errors[name] && <p className='form_error'>{errors[name]?.message}</p> }
        </div>
    )
}