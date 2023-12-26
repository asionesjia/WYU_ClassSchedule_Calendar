'use client'
import {Disclosure, Tab} from "@headlessui/react";
import {CalendarDaysIcon, ChevronUpIcon} from "@heroicons/react/20/solid";
import Image from "next/image";
import Link from "next/link";
import {useState} from "react";
import SelectClassSchedule from "@/app/components/SelectClassSchedule";
import {stringToChineseDate} from "@/app/utils/stringToChineneDate";
import HandleLocalClassScheduleFlie from "@/app/components/handleLocalClassScheduleFile";
import {ToastContainer} from "react-toastify";
import {DialogModal} from "@/app/components/dialogModal";
import SubscribeClassSchedule from "@/app/components/subscribeClassSchedule";


function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export interface ClassScheduleMetadata {
    uuid?: string;
    name?: string;
    createAt?: string;
    description?: string;
    stringTable?: string;
}
export default function Home() {
    const [classScheduleMetadata, setClassScheduleMetadata] = useState<ClassScheduleMetadata>()
    const [isOpen, setOpen] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(0)

    const dialogConfirm = () => {
        setOpen(false)
    }

    const dialogCancel = () => {
        setClassScheduleMetadata(undefined)
        setOpen(false)
    }


    return (
        <main className="flex flex-col md:flex-row md:min-h-screen justify-between bg-gary-200 bg-neutral-200 dark:bg-black">
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <div className={'p-8 md:p-16 w-full md:w-2/3'}>
                <div>
                    <p className={'font-bold text-xl text-red-600'}>制作课程表日历&日程</p>
                    <p className={'pt-2 text-md text-gray-400'}>武夷学院课程表 to 日历文件(.ics)，一键订阅导入 日历APP，将课程表添加为日历日程。妈妈再也不用担心我忘记有课了。</p>
                </div>
                <div className={'w-full max-w-md pt-6 sm:px-0'}>
                    <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
                        <Tab.List className="flex space-x-1 rounded-xl bg-gray-900/20 dark:bg-gray-500/60 p-1">
                            <Tab className={({ selected }) =>
                                classNames(
                                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5 ring-0 ring-offset-0 border-0 outline-none',
                                    selected
                                        ? 'bg-red-500 text-white shadow'
                                        : 'text-white hover:bg-red-500/[0.12] hover:text-white'
                                )
                            }>选择课表</Tab>
                            <Tab className={({ selected }) =>
                                classNames(
                                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5 ring-0 ring-offset-0 border-0 outline-none',
                                    selected
                                        ? 'bg-red-500 text-white shadow'
                                        : 'text-white hover:bg-red-500/[0.12] hover:text-white'
                                )
                            }>上传课表</Tab>
                            <Tab className={({ selected }) =>
                                classNames(
                                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5 ring-0 ring-offset-0 border-0 outline-none',
                                    selected
                                        ? 'bg-red-500 text-white shadow'
                                        : 'text-white hover:bg-red-500/[0.12] hover:text-white'
                                )
                            }>订阅导入</Tab>
                        </Tab.List>
                        <Tab.Panels className="mt-2">
                            <Tab.Panel className={classNames(
                                'rounded-xl p-3',
                                'focus:outline-none'
                            )}>
                                <SelectClassSchedule setClassScheduleMetadata={setClassScheduleMetadata}/>
                            </Tab.Panel>
                            <Tab.Panel className={classNames(
                                'rounded-xl p-3',
                                'focus:outline-none'
                            )}>
                                <HandleLocalClassScheduleFlie setClassScheduleMetadata={setClassScheduleMetadata} classScheduleMetadata={classScheduleMetadata}/>
                            </Tab.Panel>
                            <Tab.Panel className={classNames(
                                'rounded-xl p-3',
                                'focus:outline-none'
                            )}>
                                <SubscribeClassSchedule classScheduleMetadata={classScheduleMetadata}/>
                            </Tab.Panel>
                        </Tab.Panels>
                    </Tab.Group>
                    { classScheduleMetadata ?
                    <div className={'p-3 space-y-4'}>
                        <div className={'flex justify-between'}>
                            <div className={'text-md text-gray-400'}>已选择：</div>
                        </div>
                        <div className={'bg-red-500 rounded-xl text-gray-200/80 font-serif shadow-xl'}>
                            <div className={'relative p-4 space-y-1'}>
                                <p className={'font-bold text-gray-200 font-sans pb-2 border-b border-gray-200/40'}>{classScheduleMetadata?.name}.ics</p>
                                <p className={'pt-1'}>{classScheduleMetadata?.description}</p>
                                <p className={'text-right'}>-- {stringToChineseDate(classScheduleMetadata?.createAt || '')}</p>
                                <CalendarDaysIcon className={'absolute -top-3 right-2 w-14 h-14 text-gray-200/40'}/>
                            </div>
                        </div>
                        <div className={'pt-2 flex items-end justify-between'}>
                            <div className={'px-4 py-2 bg-gray-900/20 dark:bg-gray-500/60 text-sm text-white font-bold rounded-xl hover:bg-red-500 hover:border-0 hover:text-white cursor-pointer'}
                            onClick={() => setOpen(true)}>预览课表</div>
                            <div className={'px-4 py-2 bg-gray-900/20 dark:bg-gray-500/60 text-sm text-white font-bold rounded-xl hover:bg-red-500 hover:border-0 hover:text-white cursor-pointer'}
                            onClick={() => setSelectedIndex(2)}>一键订阅</div>
                        </div>
                        <DialogModal isOpen={isOpen} setIsOpen={setOpen} confirmCallback={dialogConfirm} cancelCallback={dialogCancel}>
                            { classScheduleMetadata['stringTable'] && <div className={''} dangerouslySetInnerHTML={{__html: classScheduleMetadata['stringTable']}}></div> }
                        </DialogModal>
                    </div>
                        : ''}
                </div>
            </div>
            <div className={'w-full md:w-1/3 relative'}>
                <Image src={'/bg1.jpg'} alt={'课程表日历'} width={100} height={100} className={'w-full h-screen blur-2xl absolute'} />
                <div className={'absolute p-8 md:pl-0 pt-12 w-full z-10 flex justify-center'}>
                    <div className={'w-full p-6 space-y-1 rounded-2xl bg-black bg-opacity-50'}>
                        <Disclosure defaultOpen>
                            {({ open }) => (
                                <>
                                    <Disclosure.Button className="flex w-full justify-between rounded-lg bg-white bg-opacity-20 px-4 py-2 text-left text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none">
                                        <span>什么是课程表日历?</span>
                                        <ChevronUpIcon
                                            className={`${
                                                open ? 'rotate-180 transform' : ''
                                            } h-5 w-5 text-white`}
                                        />
                                    </Disclosure.Button>
                                    <Disclosure.Panel className="px-4 pb-2 pt-4 text-sm text-gray-200">
                                        我有次在想，能不能把课程表添加到Apple日程呢？每天早上站在教学楼的楼梯口等待小程序加载、真烦了。 <br/> 我是一个懒人，所以他是--课程表日历生成器，可以将武夷学院课程表制作为日历(.ics)文件，一键 订阅(支持IOS、Android) 和 导入(仅支持部分Android) 到 日历APP，在诸如 Apple 日历、华为日历、小米日历、Google Calendar 的日历 app 中订阅/导入使用，不仅可清晰的了解课程安排，更可体验 iOS、Android 系统为日历提供的各种功能：计划出行时间、日程提醒、如 Siri 与 Google Assistant 等智能语音助理自动化服务等。
                                    </Disclosure.Panel>
                                </>
                            )}
                        </Disclosure>
                        <Disclosure defaultOpen>
                            {({ open }) => (
                                <>
                                    <Disclosure.Button className="flex w-full justify-between rounded-lg bg-white bg-opacity-20 px-4 py-2 text-left text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none">
                                        <span>使用方法</span>
                                        <ChevronUpIcon
                                            className={`${
                                                open ? 'rotate-180 transform' : ''
                                            } h-5 w-5 text-white`}
                                        />
                                    </Disclosure.Button>
                                    <Disclosure.Panel className="px-4 pb-2 pt-4 space-y-1 text-sm text-gray-200">
                                        <p>
                                            1. 先查看列表中有没有你的课表，若是有，请一键订阅；若是没有，请继续阅读。
                                        </p>
                                        <p>
                                            2. 打开武夷学院 <Link href={'http://jwmis.wuyiu.edu.cn/'} target={"_blank"} className={'font-bold text-sky-400'}>教务系统</Link>，查询到你的课表，点击 <span className={'font-bold'}>打印课表</span>，将你的课表下载下来。
                                        </p>
                                        <p>
                                            3. 上传你刚下载的课表(.xls)文件，确认无误后，点击<span className={'font-bold'}>确定</span>。
                                        </p>
                                        <p>
                                            4. 点击一键订阅、根据下面订阅导入说明进行订阅或导入。
                                        </p>
                                    </Disclosure.Panel>
                                </>
                            )}
                        </Disclosure>
                        <Disclosure defaultOpen>
                            {({ open }) => (
                                <>
                                    <Disclosure.Button id={'subscribeInfo'} className="flex w-full justify-between rounded-lg bg-white bg-opacity-20 px-4 py-2 text-left text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none">
                                        <span>订阅导入说明</span>
                                        <ChevronUpIcon
                                            className={`${
                                                open ? 'rotate-180 transform' : ''
                                            } h-5 w-5 text-white`}
                                        />
                                    </Disclosure.Button>
                                    <Disclosure.Panel className="px-4 pb-2 pt-4 space-y-1 text-sm text-gray-200">
                                        <p>
                                            IOS、MacOS用户：请直接点击 一键订阅 - Apple按钮 一键订阅到日历App。
                                        </p>
                                        <p></p>
                                        <p>
                                            其他用户：
                                        </p>
                                        <p>
                                            1. 找到系统 日历APP、找到设置或更多、找到URL订阅或导入ICS文件。
                                        </p>
                                        <p>
                                            2. 在本站复制订阅URL或下载ics文件，到日历App进行订阅或导入。
                                        </p>
                                    </Disclosure.Panel>
                                </>
                            )}
                        </Disclosure>
                    </div>
                </div>
            </div>
        </main>
  )
}
