import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const Alert = ({ alerts }) =>
    alerts !== null
    && alerts.length > 0
    && alerts.map(alert => (<div key={alert.id} className={`alert alert-${alert.alertType}`}>
        {alert.message}
    </div>
    ));

Alert.propTypes = {
    alerts: PropTypes.array.isRequired,

}
//Fetch the array of alerts from the state to use it as a prop within the component.
const mapStateToProps = state => ({
    alerts: state.alert
});

export default connect(mapStateToProps)(Alert)
