import {useDispatch, useSelector} from 'react-redux'
import axios from 'axios'
import { CONFIRMATION_MODAL_CLOSE_TYPES, MODAL_CLOSE_TYPES } from '../../../utils/globalConstantUtil'
import { deleteMachine, uiupdt} from '../../machines/machineSlice'
import { showNotification } from '../headerSlice'

function ConfirmationModalBody({ extraObject, closeModal}){

    const dispatch = useDispatch()
    const {title, bodyType, size, MachineID, index} = useSelector(state => state.modal)
    const { message, type, _id} = extraObject


    const proceedWithYes = async() => {
        if(type === CONFIRMATION_MODAL_CLOSE_TYPES.LEAD_DELETE){
            // positive response, call api or dispatch redux function
            dispatch(deleteMachine(MachineID))
            dispatch(uiupdt({index : index}))
            dispatch(showNotification({message : "Machine Deleted!", status : 1}))
        }
        closeModal()
    }

    return(
        <> 
        <p className=' text-xl mt-8 text-center'>
            {message}
        </p>

        <div className="modal-action mt-12">
                
                <button className="btn btn-outline   " onClick={() => closeModal()}>Cancel</button>

                <button className="btn btn-primary w-36" onClick={() => proceedWithYes()}>Yes</button> 

        </div>
        </>
    )
}

export default ConfirmationModalBody