package com.rythulink.backend.util;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Random;

public class IdGenerator {

        public static String generateFarmerId() {

                String yearMonth = LocalDateTime.now()
                                .format(
                                                DateTimeFormatter.ofPattern("yyyyMM"));

                int random = new Random().nextInt(99999);

                return "FMR" +
                                yearMonth +
                                String.format("%05d", random);
        }

        public static String generateBuyerId() {

                String yearMonth = LocalDateTime.now()
                                .format(
                                                DateTimeFormatter.ofPattern("yyyyMM"));

                int random = new Random().nextInt(99999);

                return "BYER" +
                                yearMonth +
                                String.format("%05d", random);
        }

        public static String generateCropId() {

                String datePart = LocalDateTime.now()
                                .format(
                                                DateTimeFormatter.ofPattern("yyyyMM"));

                int random = new Random().nextInt(90000) + 10000;

                return "CRP" + datePart + random;
        }

        public static String generateOrderId() {

                String yearMonth = LocalDateTime.now()
                                .format(
                                                DateTimeFormatter.ofPattern("yyyyMM"));

                int random = new Random().nextInt(99999);

                return "ORDER" +
                                yearMonth +
                                String.format("%05d", random);
        }
}