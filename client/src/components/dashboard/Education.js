import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Moment from 'react-moment'


const Education = ({ education }) => {
    const educationList = education.map(edu => (
        <tr key={edu._id}>
            <td>{edu.school}</td>
            <td className='hide-sm'>{edu.degree}</td>
            <td>{edu.fieldOfStudy}</td>
            <td>
                <Moment format='YYYY/MM/DD'>{edu.from}</Moment>-{' '}
                {edu.to === null ? ('Now') :
                    (<Moment format='YYYY/MM/DD'>{edu.to}</Moment>)}
            </td>
            <td>
                <button className='btn btn-danger'>Delete</button>
            </td>
        </tr>
    ))
    return (
        <Fragment>
            <h2 className='my-2'> Education Credientials</h2>
            <table className='table'>
                <thead>
                    <tr>
                        <th>School</th>
                        <th className='hide-sm'>Degree</th>
                        <th className='hide-sm'>Field</th>
                        <th className='hide-sm'>Years</th>
                        <th />
                    </tr>
                </thead>
                <tbody>{educationList}</tbody>
            </table>
        </Fragment>
    )
}

Education.propTypes = {
    education: PropTypes.array.isRequired,
}

export default connect()(Education)
