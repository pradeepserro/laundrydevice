import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import Machines from '../../features/machines'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Machines"}))   
      }, [])                                  

    return(
        <Machines /> 
    )
}

export default InternalPage