import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useSelector, useDispatch } from 'react-redux';

import { icons } from '../../../assets';
import { Check } from '../../all';
import { sendRequest } from '../../../services';

export function Item(props){
  const { onCheck, lbl, onClick, data, setData, selected, setLoading } = props;
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  const handleDragEnd = (results) => {
    let tempuser = [...data]
    let [selectedRow] = tempuser.splice(results.source.index, 1)
    tempuser.splice(results.destination.index, 0, selectedRow)
    setData(tempuser)
    updateData(selectedRow, results.source.index, results.destination.index )
  }

  const updateData = async (row, from, to) => {
    setLoading(true)
    let datas = []
    if( from < to){
      data.forEach((item, index) => {
        if(row?.categoryId === item?.categoryId){
          datas.push({categoryId: row?.categoryId, categoryName: row?.categoryName, color: row?.color, icon: row?.icon, 
            class: row?.class, useKitchenPrinter : row?.useKitchenPrinter ?? '', viewPriority : to })
        } else {
          datas.push({categoryId: item?.categoryId, categoryName: item?.categoryName, color: item?.color, icon: item?.icon, 
            class: item?.class, useKitchenPrinter : item?.useKitchenPrinter ?? '', viewPriority : (index <= to && index > from) ? index -1 : index })
        }
      })
    } else {
      data.forEach((item, index) => {
        if(row?.categoryId === item?.categoryId){
          datas.push({categoryId: row?.categoryId, categoryName: row?.categoryName, color: row?.color, icon: row?.icon, 
            class: row?.class, useKitchenPrinter : row?.useKitchenPrinter ?? '', viewPriority : to})
        } else {
          datas.push({categoryId: item?.categoryId, categoryName: item?.categoryName, color: item?.color, icon: item?.icon, 
            class: item?.class, useKitchenPrinter : item?.useKitchenPrinter ?? '', viewPriority : index >= to ? index + 1 : index })
        }
      })
    }
    await dispatch(sendRequest(user, token, 'Inventory/UpdateCategory', datas));
    setLoading(false)
  }

  return (
    <DragDropContext onDragEnd={(results) => handleDragEnd(results)}>
      <Droppable droppableId='droppable' >
        {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {data?.map( (item, index) => (
                <Draggable draggableId={item?.categoryName} index={index} key ={item?.categoryName}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className='cat_item'>
                      <Check checked={selected[item?.categoryId] ? true : false} onClick={() => onCheck(item?.categoryId, selected[item?.categoryId] ? true : false)} />
                      <div className='cat_btn' onClick={() => onClick(item)}>
                        {item?.icon
                          ? <img className='cat_icon' alt={item?.categoryId} src={icons[item?.icon - 1]} />
                          : <div className='cat_color' />
                        }
                        <div className='cat_side' >
                          <p className='cat_title'>{item?.categoryName}</p>
                          <p className='cat_text'>{item?.items ?? 0} {lbl}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>  
        )}
      </Droppable>
    </DragDropContext>
  )
}