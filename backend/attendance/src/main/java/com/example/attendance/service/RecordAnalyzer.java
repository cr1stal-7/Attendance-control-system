package com.example.attendance.service;

import com.example.attendance.model.ControlPointRecord;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class RecordAnalyzer {
    public static String determineAttendanceStatus(
            List<ControlPointRecord> studentRecords,
            LocalDateTime classStartTime,
            LocalDateTime classEndTime,
            int minAttendanceMinutes
    ) {
        if (studentRecords == null || studentRecords.isEmpty()) {
            return "Отсутствие";
        }

        List<LocalDateTime> entryTimes = new ArrayList<>();
        List<LocalDateTime> exitTimes = new ArrayList<>();

        for (ControlPointRecord record : studentRecords) {
            if ("Вход".equalsIgnoreCase(record.getDirection())) {
                entryTimes.add(record.getDatetime());
            } else if ("Выход".equalsIgnoreCase(record.getDirection())) {
                exitTimes.add(record.getDatetime());
            }
        }

        if (entryTimes.isEmpty()) {
            return "Отсутствие";
        }

        long totalAttendanceSeconds = 0;
        Iterator<LocalDateTime> entryIter = entryTimes.iterator();
        Iterator<LocalDateTime> exitIter = exitTimes.iterator();

        while (entryIter.hasNext()) {
            LocalDateTime entry = entryIter.next();
            LocalDateTime exit = exitIter.hasNext() ? exitIter.next() : classEndTime;

            LocalDateTime effectiveEntry = entry.isBefore(classStartTime) ? classStartTime : entry;
            LocalDateTime effectiveExit = exit.isAfter(classEndTime) ? classEndTime : exit;

            if (effectiveEntry.isBefore(effectiveExit)) {
                totalAttendanceSeconds += Duration.between(effectiveEntry, effectiveExit).getSeconds();
            }
        }

        long totalAttendanceMinutes = totalAttendanceSeconds / 60;

        if (totalAttendanceMinutes >= minAttendanceMinutes) {
            return "Присутствие";
        } else {
            return "Отсутствие";
        }
    }
}
