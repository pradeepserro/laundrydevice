import { useEffect } from 'react'
import { MODAL_BODY_TYPES } from '../utils/globalConstantUtil'
import { useSelector, useDispatch } from 'react-redux'
import { closeModal } from '../features/common/modalSlice'
import AddMachineModalBody from '../features/machines/components/AddMachineModalBody' 
import AddAccountModelBody from '../features/user/components/AddAccountModelBody'
import DetailsMachineModalBody from '../features/machines/components/DetailsMachineModalBody'
import ConfirmationModalBody from '../features/common/components/ConfirmationModalBody'


function ModalLayout(){


    const {isOpen, bodyType, size, extraObject, title} = useSelector(state => state.modal)
    const dispatch = useDispatch()

    const close = (e) => {
        dispatch(closeModal(e))
    }



    return(
        <>
        {/* The button to open modal */}

            {/* Put this part before </body> tag */}
            <div className={`modal ${isOpen ? "modal-open" : ""}`}>
            <div className={`modal-box  ${size === 'lg' ? 'transactionsModal' : ''}`}>
                <button className="btn btn-sm btn-circle absolute right-2 top-2" onClick={() => close()}>✕</button>
                <h3 className="font-semibold text-2xl pb-6 text-center">{title}</h3>


                {/* Loading modal body according to different modal type */}
                {
                    {
                             [MODAL_BODY_TYPES.LEAD_ADD_NEW] : <AddMachineModalBody closeModal={close} extraObject={extraObject}/>, 
                             [MODAL_BODY_TYPES.LEAD_DETAILS] : <DetailsMachineModalBody closeModal={close} extraObject={extraObject}/>,  
                             [MODAL_BODY_TYPES.ACCOUNT_ADD_NEW] : <AddAccountModelBody closeModal={close} extraObject={extraObject}/>,  
                             [MODAL_BODY_TYPES.CONFIRMATION] : <ConfirmationModalBody extraObject={extraObject} closeModal={close}/>,
                             [MODAL_BODY_TYPES.DEFAULT] : <div></div>
                    }[bodyType]
                }
            </div>
            </div>
            </>
    )
}

export default ModalLayout
