'use client'
import {useState, useEffect, Fragment, SetStateAction, Dispatch} from 'react';
import {Combobox, Transition} from "@headlessui/react";
import {CheckIcon, ChevronUpDownIcon} from "@heroicons/react/20/solid";
import {ClassScheduleMetadata} from "@/app/page";


interface SelectClassScheduleProps {
    setClassScheduleMetadata: Dispatch<SetStateAction<ClassScheduleMetadata | undefined>>;
}

const SelectClassSchedule: React.FC<SelectClassScheduleProps> = ({setClassScheduleMetadata}) => {
    const [classSchedules, setClassSchedules] = useState<ClassScheduleMetadata[]>([]);
    const [selected, setSelected] = useState(classSchedules[0])
    const [query, setQuery] = useState('')

    const filteredPeople =
        query === ''
            ? classSchedules
            : classSchedules.filter((classSchedule) =>
                classSchedule.name!
                    .toLowerCase()
                    .replace(/\s+/g, '')
                    .includes(query.toLowerCase().replace(/\s+/g, ''))
            )

    useEffect(() => {
        // 获取班级列表
        fetch('/api/classSchedules')
            .then(response => response.json())
            .then(data => setClassSchedules(data.data))
            .catch(error => console.error('Error fetching class schedules:', error));
    }, []);

    useEffect(() => {
        if(selected) {
            setClassScheduleMetadata(selected)
        }
    }, [selected, setClassScheduleMetadata]);

    return (
        <div>
            <div className={'text-gray-400 font-serif'}>
                <p>请键入选择你的课表，支持模糊搜索。如果没有你的课表就请上传，为什么没有？因为你是你们班第一个使用此工具的。</p>
            </div>
            <div className="">
                <Combobox value={selected} onChange={setSelected} >
                    <div className="relative mt-1 z-50">
                        <div className="relative w-full cursor-default overflow-hidden rounded-lg text-left shadow-xl focus:outline-none sm:text-sm">
                            <Combobox.Input
                                className="w-full border-none py-2 pl-3 pr-10 text-sm leading-7 text-gray-900 caret-red-600 font-bold focus:ring-0 ring-0 ring-offset-0 border-0 outline-none bg-gray-100 dark:bg-gray-500/60 dark:text-gray-200"
                                displayValue={(classSchedule: ClassScheduleMetadata) => classSchedule.name || ''}
                                onChange={(event) => setQuery(event.target.value)}
                            />
                            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                                <ChevronUpDownIcon
                                    className="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                />
                            </Combobox.Button>
                        </div>
                        <Transition
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                            afterLeave={() => setQuery('')}
                        >
                            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-lg py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm bg-gray-100 dark:bg-gray-500/60 dark:text-gray-200">
                                {filteredPeople.length === 0 && query !== '' ? (
                                    <div className="relative cursor-default select-none px-4 py-2 text-gray-700 dark:text-gray-200">
                                        没有数据，请上传您的课程表。
                                    </div>
                                ) : (
                                    filteredPeople.map((classSchedule) => (
                                        <Combobox.Option
                                            key={classSchedule.uuid}
                                            className={({ active }) =>
                                                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                    active ? 'bg-red-500 text-white' : 'text-gray-900 dark:text-gray-200'
                                                }`
                                            }
                                            value={classSchedule}
                                        >
                                            {({ selected, active }) => (
                                                <>
                            <span
                                className={`block truncate ${
                                    selected ? 'font-medium' : 'font-normal'
                                }`}
                            >
                              {classSchedule.name}
                            </span>
                                                    {selected ? (
                                                        <span
                                                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                                                active ? 'text-white' : 'text-red-600'
                                                            }`}
                                                        >
                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                              </span>
                                                    ) : null}
                                                </>
                                            )}
                                        </Combobox.Option>
                                    ))
                                )}
                            </Combobox.Options>
                        </Transition>
                    </div>
                </Combobox>
            </div>
        </div>
    );
};

export default SelectClassSchedule;
