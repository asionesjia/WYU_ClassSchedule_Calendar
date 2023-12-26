import React, {useEffect, useRef, useState} from "react";
import {FaApple} from "react-icons/fa6";
import {HiClipboardCopy, HiDocumentDownload} from "react-icons/hi";
import {ClassScheduleMetadata} from "@/app/page";
import Link from "next/link";
import {toast} from "react-toastify";


interface SubscribeClassScheduleProps {
    classScheduleMetadata: ClassScheduleMetadata | undefined
}

const SubscribeClassSchedule:React.FC<SubscribeClassScheduleProps> = ({classScheduleMetadata}) => {
    const [host, setHost] = useState('')

    const handleCopy = async (pre: string) => {
        try {
            await navigator.clipboard.writeText(`${pre}://${host}/ics/${classScheduleMetadata?.uuid}.ics`);
            toast('订阅URL已经复制到剪切板。', {
                type: "success"
            })
        } catch (err) {
            toast('复制到剪贴板时出现错误，请手动复制URL。')
        }
    };


    useEffect(() => {
        setHost(window.location.host)
    }, []);

    return (
        <div>
            {
                classScheduleMetadata ?
                    <div className={'space-y-8'}>
                        <div className={'space-y-4'}>
                            <div className={'text-red-600 border-l-4 border-red-600 p-4 rounded-r-2xl bg-red-100 dark:bg-red-900 dark:text-red-200'}>
                                订阅导入二选一，一般日历app两种方式都支持，任选一种方式即可。IOS用户请直接点击Apple订阅按钮。
                            </div>
                            <div className={'space-y-2'}>
                                <div className={'font-bold text-lg'}>订阅</div>
                                <div className={'text-gray-400'}>Apple用户请直接点击Apple按钮一键订阅、其他用户请先阅读订阅导入说明。</div>
                            </div>
                            <div
                                className={'w-full h-18 p-4 rounded-2xl bg-red-100 flex justify-between space-x-3 dark:bg-red-900'}>
                                <div className={'bg-red-500 rounded-2xl flex items-center px-4 flex-1'}>
                                    <input type="text" className={'w-full outline-0 border-0 bg-red-500 text-white p-0 m-0 ring-0'}
                                           value={`http://${host}/ics/${classScheduleMetadata.uuid}.ics`} readOnly={true}/>
                                </div>
                                <div className={'flex space-x-3'}>
                                    <Link href={`webcal://${host}/ics/${classScheduleMetadata.uuid}.ics`} target={'_blank'} className={'w-12 h-12 bg-red-500 rounded-2xl p-3 flex items-center justify-center hover:bg-red-700 cursor-pointer'}>
                                        <FaApple
                                            className={'w-full h-full text-white'}/></Link>
                                    <div onClick={() => handleCopy('http')} className={'w-12 h-12 bg-red-500 rounded-2xl p-3 flex items-center justify-center hover:bg-red-700 cursor-pointer'}>
                                        <HiClipboardCopy className={'w-full h-full text-white'}/></div>
                                </div>
                            </div>
                        </div>
                        <div className={'space-y-4'}>
                            <div className={'space-y-2'}>
                                <div className={'font-bold text-lg'}>导入</div>
                                <div
                                    className={'text-gray-400'}>点击下载按钮下载完成后，在日历App的设置中导入ics文件。
                                </div>
                            </div>
                            <div
                                className={'w-full p-4 rounded-2xl bg-red-100 flex justify-between space-x-3 dark:bg-red-900'}>
                                <div className={'bg-red-500 rounded-2xl flex items-center px-4 flex-1'}>
                                    <input type="text" className={'w-full outline-0 border-0 bg-red-500 text-white p-0 m-0 ring-0'}
                                           value={`http://${host}/ics/${classScheduleMetadata.uuid}.ics`} readOnly={true}/>
                                </div>
                                <div className={'flex space-x-3'}>
                                    <Link href={`http://${host}/ics/${classScheduleMetadata.uuid}.ics`} target={'_blank'} className={'w-12 h-12 bg-red-500 rounded-2xl p-3 flex items-center justify-center hover:bg-red-700'}>
                                        <HiDocumentDownload className={'w-full h-full text-white'}/></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <div className={'h-28 w-full flex flex-col justify-center items-center'}>
                        <div className={'font-bold text-4xl text-red-600'}>404</div>
                        <div className={'text-red-900'}>您还没有选择或上传课表，请先进行选择或上传。</div>
                    </div>
            }
        </div>
    )

}

export default SubscribeClassSchedule
