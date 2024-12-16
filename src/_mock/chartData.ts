const MONTHS = [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12'
]

const months = (config: any) => {
    const cfg = config || {};
    const count = cfg.count || 12;
    const section = cfg.section;
    const values = [];
    let i,value;

    for (i=0;i<count;++i){
        value = MONTHS[Math.ceil(i) % 12];
        values.push(value.substring(0, section));
    }
    return values;
};
export const lineChartData = {
    labels: months({ count: 12 }),
    datasets: [{
        label: 'Cơ sở 1',
        data: [65, 59, 80, 81, 56, 55, 40,51,68,9,2,12],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
    },
    {
        label: 'Cơ sở 2',
        data: [65, 59, 80, 81, 56, 55, 40,51,68,9,2,12],
        fill: false,
        borderColor: 'rgb(78, 60, 192)',
        tension: 0.1
    },
    {
        label: 'Cơ sở 3',
        data: [65, 59, 80, 81, 56, 55, 40,51,68,9,2,12],
        fill: false,
        borderColor: 'rgb(11, 89, 192)',
        tension: 0.1
    },
    {
        label: 'Cơ sở 4',
        data: [65, 59, 80, 81, 56, 55, 40,51,68,9,2,12],
        fill: false,
        borderColor: 'rgb(61, 251, 192)',
        tension: 0.1
    }
]
}

export const barChartData = {
    labels: months({ count: 12 }),
    datasets: [
        {
            title: "Cơ sở A",
            label: "Tiến độ",
            data: [65, 59, 80, 81, 56, 55, 60, 49, 11, 72, 52, 43],
            fill: true,
            backgroundColor: "rgb(75, 192, 192)",
            tension: 0.1,
        },
        {
            title: "Cơ sở B",
            label: "Tiến độ",
            data: [90, 90, 63, 40, 100, 67, 68, 71, 92, 92, 93, 87],
            fill: true,
            backgroundColor: "rgb(75, 192, 192)",
            tension: 0.1,
        },
        {
            title: "Cơ sở C",
            label: "Tiến độ",
            data: [92, 75, 84, 70, 78, 78, 87, 66, 86, 52, 87, 51],
            fill: true,
            backgroundColor: "rgb(75, 192, 192)",
            tension: 0.1,
        },
        {
            title: "Cơ sở D",
            label: "Tiến độ",
            data: [61, 67, 71, 98, 62, 69, 66, 67, 82, 94, 86, 88],
            fill: true,
            backgroundColor: "rgb(75, 192, 192)",
            tension: 0.1,
        },
        {
            title: "Cơ sở E",
            label: "Tiến độ",
            data: [51, 25, 15, 8, 55, 67, 11, 22, 80, 94, 86, 88],
            fill: true,
            backgroundColor: "rgb(75, 192, 192)",
            tension: 0.1,
        }
    ]
}

export const HorizontalBarChartData = {
    labels: ['Xịt mùi thơm', 'Lau kính', 'Vệ sinh nhà cửa', 'Vệ sinh nhà bếp', 'Vệ sinh nhà vệ sinh'],
    datasets: [
        {
            title: 'Cơ sở A',
            label: 'Tiến độ (%)',
            data: [12, 56, 78, 90, 43],

        },
        {
            title: 'Cơ sở B',
            label: 'Tiến độ (%)',
            data: [41, 68, 43, 27, 43],

        },
        {
            title: 'Cơ sở C',
            label: 'Tiến độ (%)',
            data: [58, 15, 85, 23, 96],

        },
        {
            title: 'Cơ sở D',
            label: 'Tiến độ (%)',
            data: [12, 56, 78, 90, 43],

        },
        {
            title: 'Cơ sở E',
            label: 'Tiến độ (%)',
            data: [86, 47, 92, 5, 56],

        },
    ]
};

export const donutData = {
    labels: [
        'Hoàn thành tốt',
        'Hoàn thành',
        'Chưa hoàn thành'
    ],
    datasets: [{
        label: 'Số lượng báo cáo',
        data: [3, 5, 2],
        backgroundColor: [
            '#00CC00',
            '#66FF66',
            '#FF0000'
        ],
        hoverOffset: 4
    }]
};

export const stackedBarChartData = {
    labels: ["Cơ sở 1", "Cơ sở 2", "Cơ sở 3", "Cơ sở 4"],
    datasets: [
        {
            label: 'Điểm số',
            data: [80, 70, 90, 85],
            backgroundColor: '#4285F4',
        },
        {
            label: 'Vi phạm',
            data: [10, 5, 7, 6],
            backgroundColor: '#FF0000',
        },
        {
            label: 'Cải thiện',
            data: [20, 15, 10, 12],
            backgroundColor: '#34A853',
        },
    ]
}